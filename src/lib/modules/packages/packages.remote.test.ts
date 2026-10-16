import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PACKAGES_FILTERS } from "$lib/modules/packages/filters/constants.js";
import {
  LaunchpadApiError,
  getSourcePackageList,
} from "$lib/server/launchpad/client.js";
import { getSourcePackages } from "./packages.remote.js";
import { packageListing } from "./test.fixtures.js";

vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));
vi.mock("$lib/server/launchpad/client.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("$lib/server/launchpad/client.js")>()),
  getSourcePackageList: vi.fn(),
}));

const listArgs = {
  distro: "ubuntu",
  sortKey: null,
  sortOrder: "none",
  page: 1,
  size: 25,
  ...DEFAULT_PACKAGES_FILTERS,
} as const;

beforeEach(() => {
  vi.mocked(getSourcePackageList)
    .mockReset()
    .mockResolvedValue(packageListing());
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
    expect(getSourcePackageList).toHaveBeenCalledExactlyOnceWith("ubuntu", {
      sourceName: "firefox",
      exactMatch: true,
      series: "noble",
      pocket: "Updates",
      maintainedBy: "ubuntu-mozillateam",
      signedBy: "userl",
      ubuntuChange: true,
      statuses: ["Pending", "Published", "Superseded", "Deleted", "Obsolete"],
      size: 50,
      page: 3,
      orderBy: ["-date_created"],
    });
  });

  it("passes default filters as null with active-only statuses and newest-first ordering", async () => {
    await getSourcePackages(listArgs);
    expect(getSourcePackageList).toHaveBeenCalledExactlyOnceWith("ubuntu", {
      sourceName: null,
      exactMatch: false,
      series: null,
      pocket: null,
      maintainedBy: null,
      signedBy: null,
      ubuntuChange: false,
      statuses: ["Pending", "Published"],
      size: 25,
      page: 1,
      orderBy: ["-date_created"],
    });
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
    expect(getSourcePackageList).toHaveBeenCalledWith(
      "ubuntu",
      expect.objectContaining({
        series: "xx",
        maintainedBy: "xx",
        signedBy: "xx",
      }),
    );
  });

  it("uses partial search with the contains mode", async () => {
    await getSourcePackages({
      ...listArgs,
      search: "fire",
      match: "contains",
    });
    expect(getSourcePackageList).toHaveBeenCalledWith(
      "ubuntu",
      expect.objectContaining({
        sourceName: "fire",
        exactMatch: false,
      }),
    );
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
    expect(getSourcePackageList).toHaveBeenCalledWith(
      "ubuntu",
      expect.objectContaining({
        maintainedBy: filters.maintainer ?? null,
        signedBy: filters.signer ?? null,
      }),
    );
  });

  it("preserves a successful empty response", async () => {
    const empty = packageListing({ sources: [], total: 0, total_pages: 0 });
    vi.mocked(getSourcePackageList).mockResolvedValue(empty);
    await expect(getSourcePackages(listArgs)).resolves.toEqual(empty);
  });

  it("logs rejected filters and returns an empty listing", async () => {
    const failure = new LaunchpadApiError(400, "https://lp.example");
    vi.mocked(getSourcePackageList).mockRejectedValue(failure);
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
      const failure = new LaunchpadApiError(status, "https://lp.example");
      vi.mocked(getSourcePackageList).mockRejectedValue(failure);
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
    vi.mocked(getSourcePackageList).mockRejectedValue(failure);
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
      expect(getSourcePackageList).toHaveBeenCalledWith(
        "ubuntu",
        expect.objectContaining({
          orderBy: ["-date_created"],
        }),
      );
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
      expect(getSourcePackageList).toHaveBeenCalledWith(
        "ubuntu",
        expect.objectContaining({
          orderBy: [expectedOrder],
        }),
      );
    });
  });
});
