import { LaunchpadApiError } from "@canonical/launchpad-client";
import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PACKAGES_FILTERS } from "$lib/modules/packages/filters/constants.js";
import { MAX_BINARY_NAMES } from "./constants.js";
import { getSourcePackages } from "./packages.remote.js";
import { packageListing } from "./test.fixtures.js";

vi.mock("$app/server", () => ({
  query: (schema: v.GenericSchema, handler: (args: unknown) => unknown) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));
vi.mock("$env/dynamic/private", () => ({
  env: { MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example" },
}));

const getSourcePackageList = vi.hoisted(() => vi.fn());
vi.mock("$lib/server/launchpad/client.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("$lib/server/launchpad/client.js")>()),
  launchpadClient: { archive: { distribution: { getSourcePackageList } } },
}));

const listArgs = {
  distro: "ubuntu",
  sortKey: null,
  sortOrder: "none",
  page: 1,
  size: 25,
  ...DEFAULT_PACKAGES_FILTERS,
} as const;

function apiError(status: number): LaunchpadApiError {
  return new LaunchpadApiError(new Response(null, { status }), undefined);
}

function expectQuery(query: Record<string, unknown>) {
  expect(getSourcePackageList).toHaveBeenCalledWith(
    expect.objectContaining({ query: expect.objectContaining(query) }),
    expect.anything(),
  );
}

beforeEach(() => {
  getSourcePackageList
    .mockReset()
    .mockResolvedValue({ data: packageListing() });
});
afterEach(() => vi.restoreAllMocks());

describe("package listing query", () => {
  it("gets rows, totals and binary IDs from one call with every filter", async () => {
    const result = await getSourcePackages({
      ...listArgs,
      search: " firefox ",
      match: "exact",
      series: "noble",
      pocket: "Updates",
      maintainer: "ubuntu-mozillateam",
      signer: "userl",
      ubuntuChange: true,
      allStatuses: true,
      page: 3,
      size: 50,
    });
    expect(result).toEqual(packageListing());
    expect(getSourcePackageList).toHaveBeenCalledExactlyOnceWith(
      {
        path: { distribution: "ubuntu", archive: "primary" },
        query: {
          name: "firefox",
          exact_match: "true",
          distro_series: "https://lp.example/api/devel/ubuntu/noble",
          pocket: "Updates",
          maintained_by: "https://lp.example/api/devel/~ubuntu-mozillateam",
          signed_by: "https://lp.example/api/devel/~userl",
          ubuntu_change: "true",
          status: JSON.stringify([
            "Pending",
            "Published",
            "Superseded",
            "Deleted",
            "Obsolete",
          ]),
          page: "3",
          page_size: "50",
          order_by: JSON.stringify(["-date_created"]),
          include_binaries: "true",
          binary_names_limit: String(MAX_BINARY_NAMES),
        },
      },
      { decode: expect.any(Function) },
    );
  });

  it("leaves default filters unset with active-only statuses and newest-first ordering", async () => {
    await getSourcePackages(listArgs);
    expect(getSourcePackageList).toHaveBeenCalledExactlyOnceWith(
      {
        path: { distribution: "ubuntu", archive: "primary" },
        query: {
          name: undefined,
          exact_match: undefined,
          distro_series: undefined,
          pocket: undefined,
          maintained_by: undefined,
          signed_by: undefined,
          ubuntu_change: undefined,
          status: JSON.stringify(["Pending", "Published"]),
          page: "1",
          page_size: "25",
          order_by: JSON.stringify(["-date_created"]),
          include_binaries: "true",
          binary_names_limit: String(MAX_BINARY_NAMES),
        },
      },
      { decode: expect.any(Function) },
    );
  });

  it.each([
    { match: null },
    { match: undefined },
    { ubuntuChange: null },
    { allStatuses: undefined },
  ])("rejects missing required filters: %j", async (filters) => {
    await expect(
      getSourcePackages({ ...listArgs, ...filters } as never),
    ).rejects.toBeInstanceOf(v.ValiError);
    expect(getSourcePackageList).not.toHaveBeenCalled();
  });

  it.each([
    { search: "" },
    { search: " " },
    { search: "a".repeat(201) },
    { series: "" },
    { series: "x" },
    { series: "Bad Value" },
    { maintainer: "" },
    { maintainer: "x" },
    { maintainer: "Bad Name" },
    { signer: "" },
    { signer: "x" },
    { signer: "-invalid" },
    { page: 0 },
    { page: 1.5 },
    { size: 0 },
    { size: 101 },
  ])("rejects invalid arguments before fetching: %j", async (args) => {
    await expect(
      getSourcePackages({ ...listArgs, ...args }),
    ).rejects.toBeInstanceOf(v.ValiError);
    expect(getSourcePackageList).not.toHaveBeenCalled();
  });

  it("accepts two-character reference names", async () => {
    await getSourcePackages({
      ...listArgs,
      series: "xx",
      maintainer: "xx",
      signer: "xx",
    });
    expectQuery({
      distro_series: "https://lp.example/api/devel/ubuntu/xx",
      maintained_by: "https://lp.example/api/devel/~xx",
      signed_by: "https://lp.example/api/devel/~xx",
    });
  });

  it("uses partial search with the contains mode", async () => {
    await getSourcePackages({
      ...listArgs,
      search: "fire",
      match: "contains",
    });
    expectQuery({ name: "fire", exact_match: "false" });
  });

  it.each([
    { maintainer: "userl" },
    { signer: "userl" },
    { maintainer: "userl", signer: null },
    { maintainer: null, signer: "userl" },
    { maintainer: "userl", signer: "userl" },
    { maintainer: "userl", signer: "userl-other" },
    { maintainer: "ubuntu-mozillateam", signer: "userl" },
  ])("keeps person/team filters independent: %j", async (filters) => {
    await getSourcePackages({ ...listArgs, ...filters });
    expectQuery({
      maintained_by: filters.maintainer
        ? `https://lp.example/api/devel/~${filters.maintainer}`
        : undefined,
      signed_by: filters.signer
        ? `https://lp.example/api/devel/~${filters.signer}`
        : undefined,
    });
  });

  it("preserves a successful empty response", async () => {
    const empty = packageListing({ sources: [], total: 0, total_pages: 0 });
    getSourcePackageList.mockResolvedValue({ data: empty });
    await expect(getSourcePackages(listArgs)).resolves.toEqual(empty);
  });

  it("logs rejected filters and returns an empty listing", async () => {
    const failure = apiError(400);
    getSourcePackageList.mockRejectedValue(failure);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      getSourcePackages({
        ...listArgs,
        series: "unknown-series",
        page: 3,
        size: 50,
      }),
    ).resolves.toEqual({
      sources: [],
      total: 0,
      total_pages: 0,
      page: 3,
      page_size: 50,
    });
    expect(log).toHaveBeenCalledWith("Failed to load source packages", failure);
    expect(getSourcePackageList).toHaveBeenCalledTimes(1);
  });

  it.each([404, 500, 503])(
    "logs HTTP %i and throws a service error without an empty result or retry",
    async (status) => {
      const failure = apiError(status);
      getSourcePackageList.mockRejectedValue(failure);
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
        status: 503,
        body: {
          message: "Couldn't load packages from Launchpad. Try again shortly.",
        },
      });
      expect(log).toHaveBeenCalledWith(
        "Failed to load source packages",
        failure,
      );
      expect(getSourcePackageList).toHaveBeenCalledTimes(1);
    },
  );

  it("surfaces malformed responses and connection failures", async () => {
    const failure = new Error("Invalid response");
    getSourcePackageList.mockRejectedValue(failure);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
      status: 503,
    });
    expect(log).toHaveBeenCalledWith("Failed to load source packages", failure);
    expect(getSourcePackageList).toHaveBeenCalledTimes(1);
  });
});

describe("package sorting", () => {
  describe.each([
    ["without a search", {}],
    ["with partial search", { search: "fire", match: "contains" }],
    ["with exact search", { search: "firefox", match: "exact" }],
  ] as const)("%s", (_, filters) => {
    it.each([
      [null, "none"],
      [null, "ascending"],
      [null, "descending"],
      ["series", "none"],
    ] as const)("uses newest-first for %s %s", async (sortKey, sortOrder) => {
      await getSourcePackages({ ...listArgs, ...filters, sortKey, sortOrder });
      expectQuery({ order_by: JSON.stringify(["-date_created"]) });
    });

    it.each([
      ["source-package", "ascending", "source_package_name"],
      ["source-package", "descending", "-source_package_name"],
      ["series", "ascending", "series"],
      ["series", "descending", "-series"],
      ["pocket", "ascending", "pocket"],
      ["pocket", "descending", "-pocket"],
      ["status", "ascending", "status"],
      ["status", "descending", "-status"],
    ] as const)("sorts by %s %s", async (sortKey, sortOrder, expectedOrder) => {
      await getSourcePackages({ ...listArgs, ...filters, sortKey, sortOrder });
      expectQuery({ order_by: JSON.stringify([expectedOrder]) });
    });
  });
});
