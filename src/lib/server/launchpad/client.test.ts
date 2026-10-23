import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_BINARY_NAMES } from "#lib/modules/packages/constants.js";
import {
  binaryDetails,
  packageListing,
} from "#lib/modules/packages/test.fixtures.js";
import {
  LaunchpadApiError,
  findPeople,
  getActiveSeriesMilestones,
  getBinaryPackageDetails,
  getDistroSeries,
  getDistroSeriesCollection,
  getPerson,
  getSourcePackageList,
} from "./client.js";
import type {
  Collection,
  DistroSeriesEntry,
  MilestoneEntry,
  PersonEntry,
  PublishingStatus,
} from "./types.js";

vi.mock("$app/env/private", () => ({
  MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example",
}));

const launchpadFetch = vi.hoisted(() => vi.fn());
vi.mock("./launchpadFetch.js", () => ({ launchpadFetch }));

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function respondWith(body: unknown, status = 200) {
  launchpadFetch.mockResolvedValue(jsonResponse(body, status));
}

function respondOnceWith(body: unknown, status = 200) {
  launchpadFetch.mockResolvedValueOnce(jsonResponse(body, status));
}

function respondOnceWithRedirect(location: string, status = 303) {
  launchpadFetch.mockResolvedValueOnce(
    new Response(null, { status, headers: { location } }),
  );
}

function requestedUrl(call = 0): URL {
  return new URL(launchpadFetch.mock.calls[call][0] as string);
}

function person(overrides: Partial<PersonEntry> = {}): PersonEntry {
  return {
    self_link: "https://lp.example/api/devel/~userl",
    resource_type_link: "https://lp.example/api/devel/#person",
    name: "userl",
    display_name: "User Launchpadio",
    is_team: false,
    mugshot_link: "",
    ...overrides,
  };
}

beforeEach(() => {
  launchpadFetch.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe("getDistroSeries", () => {
  it.each([
    ["ubuntu", "resolute", "/api/devel/ubuntu/resolute"],
    ["debian", "sid", "/api/devel/debian/sid"],
    ["my+distro", "release+1", "/api/devel/my%2Bdistro/release%2B1"],
  ])("reads the series for %s/%s", async (distro, series, path) => {
    const body = {
      name: "resolute",
      version: "26.04",
      displayname: "Resolute",
      status: "Current Stable Release",
      summary: "Release summary",
      web_link: "https://launchpad.net/ubuntu/resolute",
      translations_usage: "Launchpad",
    } satisfies DistroSeriesEntry;
    respondWith(body);

    await expect(getDistroSeries(distro, series)).resolves.toEqual(body);
    expect(requestedUrl().origin).toBe("https://lp.example");
    expect(requestedUrl().pathname).toBe(path);
    expect(requestedUrl().search).toBe("");
    expect(launchpadFetch.mock.calls[0][1]).toEqual({
      headers: { accept: "application/json" },
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });
});

describe("getDistroSeriesCollection", () => {
  it.each([
    ["ubuntu", "/api/devel/ubuntu/series"],
    ["debian", "/api/devel/debian/series"],
    ["my+distro", "/api/devel/my%2Bdistro/series"],
  ])("reads every series of %s", async (distro, path) => {
    const body = {
      start: 0,
      total_size: 1,
      entries: [
        {
          name: "resolute",
          version: "26.04",
          displayname: "Resolute",
          status: "Current Stable Release",
          summary: "Release summary",
          web_link: "https://launchpad.net/ubuntu/resolute",
          translations_usage: "Launchpad",
        },
      ],
    } satisfies Collection<DistroSeriesEntry>;
    respondWith(body);

    await expect(getDistroSeriesCollection(distro)).resolves.toEqual(body);
    expect(requestedUrl().origin).toBe("https://lp.example");
    expect(requestedUrl().pathname).toBe(path);
    expect(requestedUrl().search).toBe("");
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });

  it.each([404, 503])("preserves upstream status %i", async (status) => {
    respondWith({}, status);

    await expect(getDistroSeriesCollection("ubuntu")).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status,
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });
});

describe("getActiveSeriesMilestones", () => {
  it("requests only the first three active milestones in target-date order", async () => {
    const body = {
      start: 0,
      entries: [
        {
          name: "release",
          date_targeted: null,
          web_link: "https://launchpad.net/my+distro/+milestone/release",
        } satisfies MilestoneEntry,
      ],
      next_collection_link:
        "https://lp.example/api/devel/my%2Bdistro/release%2B1?ws.start=3",
    };
    respondWith(body);

    await expect(
      getActiveSeriesMilestones("my+distro", "release+1"),
    ).resolves.toEqual(body);
    expect(requestedUrl().origin).toBe("https://lp.example");
    expect(requestedUrl().pathname).toBe("/api/devel/my%2Bdistro/release%2B1");
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      "ws.op": "searchMilestones",
      is_active: "true",
      order_by: "date_targeted",
      "ws.size": "3",
    });
    expect(launchpadFetch.mock.calls[0][1]).toEqual({
      headers: { accept: "application/json" },
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });

  it("returns an empty collection without additional requests", async () => {
    respondWith({ start: 0, entries: [] });

    await expect(getActiveSeriesMilestones("debian", "sid")).resolves.toEqual({
      start: 0,
      entries: [],
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });
});

describe.each([getDistroSeries, getActiveSeriesMilestones])(
  "%s failures",
  (request) => {
    it.each([404, 503])("preserves upstream status %i", async (status) => {
      respondWith({}, status);

      await expect(request("ubuntu", "unknown")).rejects.toMatchObject({
        name: "LaunchpadApiError",
        status,
      });
      expect(launchpadFetch).toHaveBeenCalledTimes(1);
    });

    it("propagates network failures without retrying", async () => {
      const failure = new TypeError("Connection failed");
      launchpadFetch.mockRejectedValue(failure);

      await expect(request("ubuntu", "resolute")).rejects.toBe(failure);
      expect(launchpadFetch).toHaveBeenCalledTimes(1);
    });
  },
);

describe("getSourcePackageList", () => {
  it("gets rows, binaries and totals in one request without architecture enrichment", async () => {
    const response = packageListing();
    respondWith(response);

    await expect(
      getSourcePackageList("ubuntu", { page: 3, size: 50 }),
    ).resolves.toEqual(response);

    expect(launchpadFetch).toHaveBeenCalledTimes(1);
    expect(requestedUrl().origin).toBe("https://lp.example");
    expect(requestedUrl().pathname).toBe("/api/devel/ubuntu/+archive/primary");
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      "ws.op": "getSourcePackageList",
      page: "3",
      page_size: "50",
      include_binaries: "true",
      binary_names_limit: String(MAX_BINARY_NAMES),
    });
  });

  it("encodes sort keys as one JSON list, not repeated parameters", async () => {
    respondWith(packageListing());
    await getSourcePackageList("ubuntu", {
      orderBy: ["-status", "source_package_name"],
    });
    expect(requestedUrl().searchParams.getAll("order_by")).toEqual([
      '["-status","source_package_name"]',
    ]);
  });

  it("uses the new filter names and API references", async () => {
    respondWith(packageListing());
    await getSourcePackageList("ubuntu", {
      series: "noble",
      sourceName: "firefox",
      exactMatch: true,
      maintainedBy: "ubuntu-mozillateam",
      signedBy: "userl",
      pocket: "Updates",
      ubuntuChange: true,
      statuses: ["Pending", "Published", "Superseded", "Deleted"],
    });
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      "ws.op": "getSourcePackageList",
      include_binaries: "true",
      binary_names_limit: String(MAX_BINARY_NAMES),
      distro_series: "https://lp.example/api/devel/ubuntu/noble",
      name: "firefox",
      exact_match: "true",
      maintained_by: "https://lp.example/api/devel/~ubuntu-mozillateam",
      signed_by: "https://lp.example/api/devel/~userl",
      pocket: "Updates",
      ubuntu_change: "true",
      status: '["Pending","Published","Superseded","Deleted"]',
    });
  });

  it.each([undefined, null, false])(
    "omits unset flags and uses containment when exactMatch is %s",
    async (flag) => {
      respondWith(packageListing());
      await getSourcePackageList("ubuntu", {
        sourceName: "fire",
        exactMatch: flag,
        ubuntuChange: flag,
      });
      expect(requestedUrl().searchParams.get("exact_match")).toBe("false");
      expect(requestedUrl().searchParams.has("ubuntu_change")).toBe(false);
    },
  );

  it.each<{ statuses: PublishingStatus[] }>([
    { statuses: ["Published"] },
    { statuses: ["Superseded", "Deleted"] },
    { statuses: ["Obsolete"] },
    { statuses: [] },
  ])("sends exactly $statuses as one JSON list", async ({ statuses }) => {
    respondWith(packageListing());
    await getSourcePackageList("ubuntu", { statuses });
    expect(requestedUrl().searchParams.getAll("status")).toEqual([
      JSON.stringify(statuses),
    ]);
    expect(requestedUrl().searchParams.has("include_inactive")).toBe(false);
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, null])("omits unset statuses %s", async (statuses) => {
    respondWith(packageListing());
    await getSourcePackageList("ubuntu", { statuses });
    expect(requestedUrl().searchParams.has("status")).toBe(false);
  });

  it.each([undefined, null, ""])(
    "omits unset references/search and exact_match for %s",
    async (unset) => {
      respondWith(packageListing());
      await getSourcePackageList("ubuntu", {
        sourceName: unset,
        series: unset,
        maintainedBy: unset,
        signedBy: unset,
        exactMatch: true,
      });
      expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
        "ws.op": "getSourcePackageList",
        include_binaries: "true",
        binary_names_limit: String(MAX_BINARY_NAMES),
      });
    },
  );

  it("accepts a real empty first page with zero total pages", async () => {
    const empty = packageListing({ sources: [], total: 0, total_pages: 0 });
    respondWith(empty);
    await expect(getSourcePackageList("ubuntu", {})).resolves.toEqual(empty);
  });

  it.each([
    { shown: 0, total: 0 },
    { shown: 5, total: 5 },
    { shown: 5, total: 1239 },
    { shown: 100, total: 100 },
    { shown: 100, total: 101 },
  ])(
    "preserves all $shown returned names and their total of $total",
    async ({ shown, total }) => {
      const response = packageListing({
        sources: [
          {
            ...packageListing().sources[0],
            binaries: Array.from({ length: shown }, (_, index) => ({
              id: index + 1,
              name: `binary-${index + 1}`,
            })),
            binaries_total: total,
          },
        ],
      });
      respondWith(response);
      await expect(getSourcePackageList("ubuntu", {})).resolves.toStrictEqual(
        response,
      );
      expect(launchpadFetch).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    { total: "1" },
    { total: -1 },
    { total_pages: undefined },
    { page_size: 101 },
    { sources: [{ ...packageListing().sources[0], binaries: undefined }] },
    { sources: [{ ...packageListing().sources[0], id: 1.5 }] },
    { sources: [{ ...packageListing().sources[0], status: "Unknown" }] },
    {
      sources: [{ ...packageListing().sources[0], binaries_total: undefined }],
    },
    { sources: [{ ...packageListing().sources[0], binaries_total: "2" }] },
    { sources: [{ ...packageListing().sources[0], binaries_total: -1 }] },
    { sources: [{ ...packageListing().sources[0], binaries_total: 2.5 }] },
    { sources: [{ ...packageListing().sources[0], binaries_total: null }] },
    {
      sources: [
        {
          ...packageListing().sources[0],
          binaries_total: Number.MAX_SAFE_INTEGER + 1,
        },
      ],
    },
  ])("rejects malformed successful responses: %j", async (overrides) => {
    respondWith({ ...packageListing(), ...overrides });
    await expect(getSourcePackageList("ubuntu", {})).rejects.toThrow();
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });

  it.each([400, 404, 503])(
    "preserves upstream status %i without retrying",
    async (status) => {
      respondWith("API error", status);
      await expect(getSourcePackageList("ubuntu", {})).rejects.toMatchObject({
        name: "LaunchpadApiError",
        status,
      });
      expect(launchpadFetch).toHaveBeenCalledTimes(1);
    },
  );
});

describe("getBinaryPackageDetails", () => {
  it("loads one publication from the selected distribution in one request", async () => {
    const details = binaryDetails();
    respondWith(details);
    await expect(getBinaryPackageDetails("debian", 101)).resolves.toEqual(
      details,
    );
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
    expect(requestedUrl().pathname).toBe("/api/devel/debian/+archive/primary");
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      "ws.op": "getBinaryPackageDetails",
      binary_id: "101",
    });
  });

  it("accepts an empty file list and description", async () => {
    respondWith(binaryDetails({ files: [], description: "" }));
    await expect(getBinaryPackageDetails("ubuntu", 101)).resolves.toMatchObject(
      {
        files: [],
        description: "",
      },
    );
  });

  it.each([
    { files: undefined },
    { id: 0 },
    { description: null },
    { files: [{ filename: "file.deb", size: -1, url: "not-a-url" }] },
  ])("rejects malformed details: %j", async (overrides) => {
    respondWith({ ...binaryDetails(), ...overrides });
    await expect(getBinaryPackageDetails("ubuntu", 101)).rejects.toThrow();
  });

  it.each([400, 404, 503])("preserves upstream status %i", async (status) => {
    respondWith("API error", status);
    await expect(getBinaryPackageDetails("ubuntu", 101)).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status,
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });
});

describe("findPeople", () => {
  it("searches people and teams by text without pagination parameters", async () => {
    respondWith({ start: 0, entries: [person()] });
    const collection = await findPeople("user");
    expect(requestedUrl().pathname).toBe("/api/devel/people");
    expect(Object.fromEntries(requestedUrl().searchParams)).toEqual({
      "ws.op": "find",
      text: "user",
    });
    expect(collection.entries[0].display_name).toBe("User Launchpadio");
  });
});

describe("getPerson", () => {
  it("looks a person up by name", async () => {
    respondWith(person());
    const found = await getPerson("userl");
    expect(requestedUrl().pathname).toBe("/api/devel/~userl");
    expect(found?.display_name).toBe("User Launchpadio");
  });

  it.each([404, 410])(
    "finds nobody when Launchpad answers %i",
    async (status) => {
      respondWith("Object: None, name: '~nobody'", status);
      await expect(getPerson("nobody")).resolves.toBeNull();
    },
  );

  it("throws LaunchpadApiError on other failures", async () => {
    respondWith({}, 500);
    await expect(getPerson("userl")).rejects.toBeInstanceOf(LaunchpadApiError);
  });

  it("follows the redirect to the person", async () => {
    respondOnceWithRedirect("/api/devel/~userl");
    respondOnceWith(person());
    const found = await getPerson("userl-old");
    expect(requestedUrl(1).pathname).toBe("/api/devel/~userl");
    expect(launchpadFetch.mock.calls[1][1]).toEqual({
      headers: { accept: "application/json" },
    });
    expect(found?.name).toBe("userl");
  });

  it("returns the person reached after five redirects", async () => {
    for (const location of [
      "/api/devel/~userl-old",
      "~userl-alias",
      "~userl-new",
      "~userl-current",
      "~userl",
    ]) {
      respondOnceWithRedirect(location);
    }
    respondOnceWith(person());
    const found = await getPerson("userl-older");
    expect(launchpadFetch).toHaveBeenCalledTimes(6);
    expect(requestedUrl(5).pathname).toBe("/api/devel/~userl");
    expect(found?.name).toBe("userl");
  });

  it("stops after five redirects and rejects a further redirect", async () => {
    launchpadFetch.mockResolvedValue(
      new Response(null, {
        status: 303,
        headers: { location: "/api/devel/~userl" },
      }),
    );
    await expect(getPerson("userl-old")).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status: 303,
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(6);
  });

  it("stops when a redirect has no location", async () => {
    respondWith({}, 303);
    await expect(getPerson("userl-old")).rejects.toMatchObject({
      name: "LaunchpadApiError",
      status: 303,
    });
    expect(launchpadFetch).toHaveBeenCalledTimes(1);
  });
});
