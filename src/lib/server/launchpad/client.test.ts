import { beforeEach, describe, expect, it, vi } from "vitest";
import { LaunchpadApiError, getPublishedSources } from "./client.js";
import type { SourcePackagePublishingEntry } from "./types.js";

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

  it("throws LaunchpadApiError on non-2xx", async () => {
    respondWith({}, 503);
    await expect(getPublishedSources("ubuntu", {})).rejects.toBeInstanceOf(
      LaunchpadApiError,
    );
  });
});
