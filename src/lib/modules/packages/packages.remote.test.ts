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
// Fail locally if a consumer bypasses the shared client's Fetch transport.
vi.mock("undici", async (importOriginal) => ({
  ...(await importOriginal<typeof import("undici")>()),
  request: vi.fn().mockRejectedValue(new Error("Use the shared Fetch client")),
}));
const fetchMock = vi.hoisted(() => {
  const fetchMock = vi.fn<(request: Request) => Promise<Response>>();
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
});
const listArgs = {
  distro: "ubuntu",
  sortKey: null,
  sortOrder: "none",
  page: 1,
  size: 25,
  ...DEFAULT_PACKAGES_FILTERS,
} as const;

function requestedUrl(): URL {
  return new URL(fetchMock.mock.calls[0][0].url);
}
function parameters() {
  return Object.fromEntries(requestedUrl().searchParams);
}

beforeEach(() => {
  fetchMock
    .mockReset()
    .mockImplementation(async () => Response.json(packageListing()));
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("package listing query", () => {
  it("gets rows, totals and binary IDs in one Fetch call with every filter", async () => {
    await expect(
      getSourcePackages({
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
      }),
    ).resolves.toEqual(packageListing());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestedUrl().origin + requestedUrl().pathname).toBe(
      "https://lp.example/api/devel/ubuntu/+archive/primary",
    );
    expect(parameters()).toEqual({
      "ws.op": "getSourcePackageList",
      name: "firefox",
      exact_match: "true",
      distro_series: "https://lp.example/api/devel/ubuntu/noble",
      pocket: "Updates",
      maintained_by: "https://lp.example/api/devel/~ubuntu-mozillateam",
      signed_by: "https://lp.example/api/devel/~userl",
      ubuntu_change: "true",
      status: '["Pending","Published","Superseded","Deleted","Obsolete"]',
      page: "3",
      page_size: "50",
      order_by: '["-date_created"]',
      include_binaries: "true",
      binary_names_limit: String(MAX_BINARY_NAMES),
    });
    expect(fetchMock.mock.calls[0][0].headers.get("accept")).toBe(
      "application/json",
    );
  });

  it("omits unset filters and sends active-only statuses as one JSON list", async () => {
    await getSourcePackages(listArgs);
    expect(parameters()).toEqual({
      "ws.op": "getSourcePackageList",
      status: '["Pending","Published"]',
      page: "1",
      page_size: "25",
      order_by: '["-date_created"]',
      include_binaries: "true",
      binary_names_limit: String(MAX_BINARY_NAMES),
    });
  });

  it.each([
    { match: null },
    { match: undefined },
    { ubuntuChange: null },
    { allStatuses: undefined },
    { search: "" },
    { search: " " },
    { search: "a".repeat(201) },
    { series: "x" },
    { series: "Bad Value" },
    { maintainer: "" },
    { signer: "-invalid" },
    { page: 0 },
    { page: 1.5 },
    { size: 0 },
    { size: 101 },
  ])("rejects invalid arguments before fetching: %j", async (args) => {
    await expect(
      getSourcePackages({ ...listArgs, ...args } as never),
    ).rejects.toBeInstanceOf(v.ValiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses partial search and keeps person/team filters independent", async () => {
    await getSourcePackages({
      ...listArgs,
      search: "fire",
      maintainer: "xx",
      signer: "userl",
    });
    expect(parameters()).toMatchObject({
      name: "fire",
      exact_match: "false",
      maintained_by: "https://lp.example/api/devel/~xx",
      signed_by: "https://lp.example/api/devel/~userl",
    });
  });

  it("preserves an empty response", async () => {
    const empty = packageListing({ sources: [], total: 0, total_pages: 0 });
    fetchMock.mockResolvedValueOnce(Response.json(empty));
    await expect(getSourcePackages(listArgs)).resolves.toEqual(empty);
  });

  it("returns an empty listing for rejected filters without retrying", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(
      new Response("Unknown series", { status: 400 }),
    );
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
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("passes a missing distribution or page through as 404", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(new Response("Not found", { status: 404 }));
    await expect(
      getSourcePackages({ ...listArgs, distro: "soss" }),
    ).rejects.toMatchObject({
      status: 404,
      body: { message: "Packages not found." },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([500, 503])(
    "maps HTTP %i to a service error without retrying",
    async (status) => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      fetchMock.mockResolvedValueOnce(new Response("API error", { status }));
      await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
        status: 503,
      });
      expect(log).toHaveBeenCalledWith(
        "Failed to load source packages",
        expect.objectContaining({ name: "LaunchpadApiError", status }),
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    { total: "1" },
    { total_pages: undefined },
    { sources: [{ ...packageListing().sources[0], binaries_total: -1 }] },
    { sources: [{ ...packageListing().sources[0], binaries: undefined }] },
  ])("rejects malformed successful responses: %j", async (overrides) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(
      Response.json({ ...packageListing(), ...overrides }),
    );
    await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
      status: 503,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("logs connection failures", async () => {
    const failure = new TypeError("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(failure);
    await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
      status: 503,
    });
    expect(log).toHaveBeenCalledWith("Failed to load source packages", failure);
  });
});

describe("package sorting", () => {
  it.each([
    [null, "none", "-date_created"],
    [null, "ascending", "-date_created"],
    ["series", "none", "-date_created"],
    ["source-package", "ascending", "source_package_name"],
    ["source-package", "descending", "-source_package_name"],
    ["series", "ascending", "series"],
    ["series", "descending", "-series"],
    ["pocket", "ascending", "pocket"],
    ["pocket", "descending", "-pocket"],
    ["status", "ascending", "status"],
    ["status", "descending", "-status"],
  ] as const)("sorts by %s %s", async (sortKey, sortOrder, expected) => {
    await getSourcePackages({
      ...listArgs,
      search: "fire",
      sortKey,
      sortOrder,
    });
    expect(requestedUrl().searchParams.getAll("order_by")).toEqual([
      JSON.stringify([expected]),
    ]);
  });
});
