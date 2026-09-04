import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LaunchpadApiError,
  getBinaryFileUrls,
  getPublishedBinaries,
  getPublishedSources,
} from "./client.js";
import type {
  BinaryPackagePublishingEntry,
  SourcePackagePublishingEntry,
} from "./types.js";

// Hoisted above the imports by vitest; stubs the private env for client.ts.
vi.mock("$env/dynamic/private", () => ({
  env: { MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example" },
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
    published_binaries: [],
    ...overrides,
  };
}

function binaryEntry(
  overrides: Partial<BinaryPackagePublishingEntry> = {},
): BinaryPackagePublishingEntry {
  return {
    self_link:
      "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/1",
    display_name: "0ad 0.28.0-3 in resolute amd64",
    binary_package_name: "0ad",
    binary_package_version: "0.28.0-3",
    status: "Published",
    pocket: "Release",
    component_name: "universe",
    distro_arch_series_link:
      "https://lp.example/api/devel/ubuntu/resolute/amd64",
    source_package_name: "0ad",
    source_package_version: "0.28.0-3",
    date_published: "2026-02-25T15:38:34.905768+00:00",
    architecture_specific: true,
    ...overrides,
  };
}

function respondWith(body: unknown, status = 200) {
  launchpadFetch.mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
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

describe("getPublishedBinaries", () => {
  it("loads every page for the selected source publication", async () => {
    const nextUrl =
      "https://lp.example/api/devel/ubuntu/+archive/primary/+sourcepub/42?ws.op=getPublishedBinaries&active_binaries_only=true&ws.start=1";
    launchpadFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            start: 0,
            entries: [binaryEntry()],
            next_collection_link: nextUrl,
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            start: 1,
            entries: [
              binaryEntry({
                self_link:
                  "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/2",
                distro_arch_series_link:
                  "https://lp.example/api/devel/ubuntu/resolute/arm64",
              }),
            ],
          }),
          { status: 200 },
        ),
      );

    const entries = await getPublishedBinaries("ubuntu", "42");

    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.pathname).toBe(
      "/api/devel/ubuntu/+archive/primary/+sourcepub/42",
    );
    expect(url.searchParams.get("ws.op")).toBe("getPublishedBinaries");
    expect(url.searchParams.get("active_binaries_only")).toBe("true");
    expect(launchpadFetch.mock.calls[1][0]).toBe(nextUrl);
    expect(entries).toHaveLength(2);
  });

  it("returns the first 20 pages when the collection exceeds the limit", async () => {
    let page = 0;
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    launchpadFetch.mockImplementation(() => {
      page += 1;
      return Promise.resolve(
        new Response(
          JSON.stringify({
            start: page - 1,
            entries: [
              binaryEntry({
                self_link: `https://lp.example/+binarypub/${page}`,
              }),
            ],
            next_collection_link: `https://lp.example/page/${page}`,
          }),
          { status: 200 },
        ),
      );
    });

    const entries = await getPublishedBinaries("ubuntu", "42");

    expect(entries).toHaveLength(20);
    expect(entries.at(-1)?.self_link).toBe("https://lp.example/+binarypub/20");
    expect(launchpadFetch).toHaveBeenCalledTimes(20);
    expect(consoleWarn).toHaveBeenCalledWith(
      "Launchpad collection page limit reached",
      expect.objectContaining({ pagesLoaded: 20 }),
    );
  });

  it("returns collected entries when pagination repeats a URL", async () => {
    const repeatedUrl = "https://lp.example/page/1";
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    launchpadFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            start: 0,
            entries: [binaryEntry()],
            next_collection_link: repeatedUrl,
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            start: 1,
            entries: [
              binaryEntry({
                self_link: "https://lp.example/+binarypub/2",
              }),
            ],
            next_collection_link: repeatedUrl,
          }),
          { status: 200 },
        ),
      );

    const entries = await getPublishedBinaries("ubuntu", "42");

    expect(entries).toHaveLength(2);
    expect(launchpadFetch).toHaveBeenCalledTimes(2);
    expect(consoleWarn).toHaveBeenCalledWith(
      "Launchpad collection pagination loop detected",
      expect.objectContaining({ repeatedUrl, pagesLoaded: 2 }),
    );
  });
});

describe("getBinaryFileUrls", () => {
  it("requests metadata for a binary publication", async () => {
    respondWith([]);

    await getBinaryFileUrls(
      "https://lp.example/api/devel/ubuntu/+archive/primary/+binarypub/123",
    );

    const url = new URL(launchpadFetch.mock.calls[0][0] as string);
    expect(url.pathname).toBe(
      "/api/devel/ubuntu/+archive/primary/+binarypub/123",
    );
    expect(url.searchParams.get("ws.op")).toBe("binaryFileUrls");
    expect(url.searchParams.get("include_meta")).toBe("true");
  });
});
