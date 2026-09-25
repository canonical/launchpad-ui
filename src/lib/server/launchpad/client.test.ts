import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LaunchpadApiError,
  findPeople,
  getPerson,
  getPublishedSources,
  getPublishedSourcesTotal,
} from "./client.js";
import type { PersonEntry, SourcePackagePublishingEntry } from "./types.js";

// Hoisted above the imports by vitest; stubs the private env for client.ts.
vi.mock("$env/dynamic/private", () => ({
  env: {
    MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example",
  },
}));

const launchpadFetch = vi.hoisted(() => vi.fn());
vi.mock("./launchpadFetch.js", () => ({ launchpadFetch }));

function entry(
  overrides: Partial<SourcePackagePublishingEntry> = {},
): SourcePackagePublishingEntry {
  return {
    self_link:
      "https://lp.example/api/devel/ubuntu/+archive/primary/+sourcepub/1",
    resource_type_link:
      "https://lp.example/api/devel/#source_package_publishing_history",
    display_name: "0ad 0.28.0-3 in resolute",
    source_package_name: "0ad",
    source_package_version: "0.28.0-3",
    status: "Published",
    pocket: "Release",
    component_name: "universe",
    section_name: "games",
    distro_series_link: "https://lp.example/api/devel/ubuntu/resolute",
    archive_link: "https://lp.example/api/devel/ubuntu/+archive/primary",
    date_published: "2026-02-25T15:38:34.905768+00:00",
    date_created: "2026-02-25T13:52:22.996244+00:00",
    date_superseded: null,
    date_made_pending: null,
    date_removed: null,
    ...overrides,
  };
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

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function requestedUrl(call = 0): URL {
  return new URL(launchpadFetch.mock.calls[call][0] as string);
}

function requestedHeaders(call = 0): Record<string, string> {
  return (launchpadFetch.mock.calls[call][1] as RequestInit).headers as Record<
    string,
    string
  >;
}

function person(overrides: Partial<PersonEntry> = {}): PersonEntry {
  return {
    self_link: "https://lp.example/api/devel/~userl",
    resource_type_link: "https://lp.example/api/devel/#person",
    name: "userl",
    display_name: "User Launchpadio",
    is_team: false,
    mugshot_link: "https://lp.example/media/userl.jpg",
    ...overrides,
  };
}

beforeEach(() => {
  launchpadFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getPublishedSources", () => {
  it("builds the primary-archive URL with ws.op and paging params", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", { size: 25, start: 50 });

    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.origin).toBe("https://lp.example");
    expect(url.pathname).toBe("/api/devel/ubuntu/+archive/primary");
    expect(url.searchParams.get("ws.op")).toBe("getPublishedSources");
    expect(url.searchParams.get("ws.size")).toBe("25");
    expect(url.searchParams.get("ws.start")).toBe("50");
  });

  it("repeats order_by and status params", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", {
      orderBy: ["-status", "source_package_name"],
      status: ["Published", "Pending"],
    });

    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.searchParams.getAll("order_by")).toEqual([
      "-status",
      "source_package_name",
    ]);
    expect(url.searchParams.getAll("status")).toEqual(["Published", "Pending"]);
  });

  it("filters by series through the distro series link", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", { series: "stonking" });

    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.searchParams.get("distro_series")).toBe(
      "https://lp.example/api/devel/ubuntu/stonking",
    );
  });

  it.each([undefined, null, false])(
    "filters by a source name substring when exactMatch is %s",
    async (exactMatch) => {
      respondWith({ start: 0, entries: [] });
      await getPublishedSources("ubuntu", { sourceName: "super", exactMatch });

      expect(requestedUrl().searchParams.get("source_name")).toBe("super");
      expect(requestedUrl().searchParams.get("exact_match")).toBe("false");
    },
  );

  it("filters by an exact source name", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", {
      sourceName: "superhref",
      exactMatch: true,
    });

    expect(requestedUrl().searchParams.get("exact_match")).toBe("true");
  });

  it.each([undefined, null, ""])(
    "omits exact_match when sourceName is %s",
    async (sourceName) => {
      respondWith({ start: 0, entries: [] });
      await getPublishedSources("ubuntu", { sourceName, exactMatch: true });

      expect(requestedUrl().searchParams.has("source_name")).toBe(false);
      expect(requestedUrl().searchParams.has("exact_match")).toBe(false);
    },
  );

  it("filters by pocket", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", { pocket: "Proposed" });

    expect(requestedUrl().searchParams.get("pocket")).toBe("Proposed");
  });

  it("filters by maintainer and signer through person links", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", {
      maintainedBy: "ubuntu-mozillateam",
      signedBy: "userl",
    });

    const { searchParams } = requestedUrl();
    expect(searchParams.get("maintained_by")).toBe(
      "https://lp.example/api/devel/~ubuntu-mozillateam",
    );
    expect(searchParams.get("signed_by")).toBe(
      "https://lp.example/api/devel/~userl",
    );
  });

  it("asks for Ubuntu changes only when the filter is set", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", { ubuntuChange: true });
    expect(requestedUrl().searchParams.get("ubuntu_change")).toBe("true");

    launchpadFetch.mockClear();
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", { ubuntuChange: false });
    expect(requestedUrl().searchParams.has("ubuntu_change")).toBe(false);
  });

  it("omits status when no statuses are given", async () => {
    respondWith({ start: 0, entries: [] });
    await getPublishedSources("ubuntu", {});

    expect(requestedUrl().searchParams.has("status")).toBe(false);
  });

  it("returns the parsed collection", async () => {
    respondWith({ start: 0, entries: [entry()] });
    const result = await getPublishedSources("ubuntu", {});
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].source_package_name).toBe("0ad");
  });

  it("throws LaunchpadApiError when the response is unsuccessful", async () => {
    respondWith({}, 503);
    await expect(getPublishedSources("ubuntu", {})).rejects.toBeInstanceOf(
      LaunchpadApiError,
    );
  });
});

describe("getPublishedSourcesTotal", () => {
  it("asks for the bare total of the filtered collection without paging", async () => {
    respondWith(461194);
    const total = await getPublishedSourcesTotal("ubuntu", {
      series: "stonking",
      status: ["Published"],
    });

    expect(total).toBe(461194);
    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.pathname).toBe("/api/devel/ubuntu/+archive/primary");
    expect(url.searchParams.get("ws.op")).toBe("getPublishedSources");
    expect(url.searchParams.get("ws.show")).toBe("total_size");
    expect(url.searchParams.get("distro_series")).toBe(
      "https://lp.example/api/devel/ubuntu/stonking",
    );
    expect(url.searchParams.getAll("status")).toEqual(["Published"]);
    expect(url.searchParams.has("ws.size")).toBe(false);
    expect(url.searchParams.has("ws.start")).toBe(false);
  });

  it("throws LaunchpadApiError when Launchpad times out", async () => {
    respondWith("Error: Timeout", 503);
    await expect(getPublishedSourcesTotal("ubuntu", {})).rejects.toBeInstanceOf(
      LaunchpadApiError,
    );
  });

  it("rejects a response that is not a number", async () => {
    respondWith({ total_size: 3 });
    await expect(getPublishedSourcesTotal("ubuntu", {})).rejects.toThrow(
      "did not return a total",
    );
  });

  it("applies the same filters as the listing", async () => {
    respondWith(12);
    await getPublishedSourcesTotal("ubuntu", {
      sourceName: "superhref",
      exactMatch: true,
      pocket: "Updates",
      signedBy: "userl",
      ubuntuChange: true,
    });

    const { searchParams } = requestedUrl();
    expect(searchParams.get("ws.show")).toBe("total_size");
    expect(searchParams.get("source_name")).toBe("superhref");
    expect(searchParams.get("exact_match")).toBe("true");
    expect(searchParams.get("pocket")).toBe("Updates");
    expect(searchParams.get("signed_by")).toBe(
      "https://lp.example/api/devel/~userl",
    );
    expect(searchParams.get("ubuntu_change")).toBe("true");
  });
});

describe("empty and unset published source filters", () => {
  it.each([undefined, null])(
    "omits %s filters from listing and total URLs while preserving pagination and sorting",
    async (unset) => {
      const filters = {
        series: unset,
        status: unset,
        sourceName: unset,
        exactMatch: unset,
        pocket: unset,
        maintainedBy: unset,
        signedBy: unset,
        ubuntuChange: unset,
      };
      respondOnceWith({ start: 0, entries: [] });
      respondOnceWith(12);

      await getPublishedSources("ubuntu", {
        ...filters,
        size: 25,
        start: 0,
        orderBy: ["-date_created"],
      });
      await getPublishedSourcesTotal("ubuntu", filters);

      expect(Object.fromEntries(requestedUrl(0).searchParams)).toEqual({
        "ws.op": "getPublishedSources",
        "ws.size": "25",
        "ws.start": "0",
        order_by: "-date_created",
      });
      expect(Object.fromEntries(requestedUrl(1).searchParams)).toEqual({
        "ws.op": "getPublishedSources",
        "ws.show": "total_size",
      });
    },
  );

  it.each([
    [{ series: "" }, {}],
    [{ sourceName: "" }, {}],
    [{ sourceName: "", exactMatch: true }, {}],
    [{ maintainedBy: "" }, {}],
    [{ signedBy: "" }, {}],
    [
      {
        series: "",
        sourceName: "",
        maintainedBy: "",
        signedBy: "",
        exactMatch: true,
      },
      {},
    ],
    [
      {
        series: "",
        sourceName: "superhref",
        maintainedBy: "",
        signedBy: "userl",
        exactMatch: false,
        pocket: "Updates",
        ubuntuChange: true,
      },
      {
        source_name: "superhref",
        exact_match: "false",
        signed_by: "https://lp.example/api/devel/~userl",
        pocket: "Updates",
        ubuntu_change: "true",
      },
    ],
  ] as const)(
    "omits empty filters in %j from listing and total URLs",
    async (filters, expectedParams) => {
      respondOnceWith({ start: 0, entries: [] });
      respondOnceWith(12);

      await getPublishedSources("ubuntu", { ...filters, size: 25, start: 0 });
      await getPublishedSourcesTotal("ubuntu", filters);

      expect(Object.fromEntries(requestedUrl(0).searchParams)).toEqual({
        "ws.op": "getPublishedSources",
        "ws.size": "25",
        "ws.start": "0",
        ...expectedParams,
      });
      expect(Object.fromEntries(requestedUrl(1).searchParams)).toEqual({
        "ws.op": "getPublishedSources",
        "ws.show": "total_size",
        ...expectedParams,
      });
    },
  );
});

describe("findPeople", () => {
  it("searches people and teams by text without pagination parameters", async () => {
    respondWith({ start: 0, entries: [person()] });
    const collection = await findPeople("user");

    const url = requestedUrl();
    expect(url.pathname).toBe("/api/devel/people");
    expect(Object.fromEntries(url.searchParams)).toEqual({
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
    expect(requestedHeaders(1)).toEqual({ accept: "application/json" });
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
