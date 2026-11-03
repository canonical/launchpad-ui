import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import {
  TestObserverApiError,
  getImageArtifacts,
  getImageCounts,
  getImages,
} from "./client.js";
import { imagesFixture } from "./image.fixtures.js";
import type { ImageArtifact } from "./types.js";

const mockEnv = vi.hoisted(
  (): { TEST_OBSERVER_IMAGE_ARTIFACTS_URL: string | undefined } => ({
    TEST_OBSERVER_IMAGE_ARTIFACTS_URL:
      "https://observer.example/v1/artefacts?family=image",
  }),
);

vi.mock("$env/dynamic/private", () => ({ env: mockEnv }));

function artifact(overrides: Partial<ImageArtifact> = {}): ImageArtifact {
  return {
    id: 1,
    name: "resolute-desktop-amd64.iso",
    os: "ubuntu",
    release: "resolute",
    stage: "pending",
    status: "UNDECIDED",
    version: "20261016",
    image_url: "https://example.com/resolute-desktop-amd64.iso",
    bug_link: "",
    all_environment_reviews_count: 2,
    completed_environment_reviews_count: 0,
    archived: false,
    created_at: "2026-10-16T05:04:50.101354",
    ...overrides,
  };
}

let fetcher: MockInstance<typeof fetch>;
let currentTime = Date.now();

function respondWith(body: unknown, status = 200) {
  fetcher.mockResolvedValue(Response.json(body, { status }));
}

beforeEach(() => {
  vi.useFakeTimers();
  currentTime += 60_001;
  vi.setSystemTime(currentTime);
  fetcher = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  currentTime = Date.now();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("getImageArtifacts", () => {
  it("shares concurrent requests and caches successful responses", async () => {
    const body = [artifact()];
    respondWith(body);
    await expect(
      Promise.all([getImageArtifacts(), getImageArtifacts()]),
    ).resolves.toEqual([body, body]);
    await expect(getImageArtifacts()).resolves.toEqual(body);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("refreshes cached responses after one minute", async () => {
    respondWith([artifact()]);
    await getImageArtifacts();
    vi.advanceTimersByTime(60_000);
    respondWith([artifact({ id: 2 })]);
    await expect(getImageArtifacts()).resolves.toEqual([artifact({ id: 2 })]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not cache failed requests", async () => {
    fetcher.mockRejectedValueOnce(new TypeError("Connection failed"));
    await expect(getImageArtifacts()).rejects.toThrow("Connection failed");
    respondWith([artifact()]);
    await expect(getImageArtifacts()).resolves.toEqual([artifact()]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("requires an endpoint before fetching", async () => {
    const url = mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL;
    mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL = "";
    try {
      await expect(getImageArtifacts()).rejects.toThrow(
        "TEST_OBSERVER_IMAGE_ARTIFACTS_URL is not configured",
      );
      expect(fetcher).not.toHaveBeenCalled();
    } finally {
      mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL = url;
    }
  });

  it("fetches image artefacts from the API", async () => {
    const body = [artifact(), artifact({ id: 2, os: "ubuntustudio" })];
    respondWith(body);

    await expect(getImageArtifacts()).resolves.toEqual(body);
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(
      mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL,
      { headers: { accept: "application/json" } },
    );
  });

  it("returns an empty collection without additional requests", async () => {
    respondWith([]);

    await expect(getImageArtifacts()).resolves.toEqual([]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("strips fields outside the artifact schema", async () => {
    const body = artifact();
    respondWith([{ ...body, reviewers: [], assignee: null }]);

    await expect(getImageArtifacts()).resolves.toEqual([body]);
  });

  it.each([404, 503])("preserves upstream status %i", async (status) => {
    respondWith({}, status);

    const request = getImageArtifacts();
    await expect(request).rejects.toBeInstanceOf(TestObserverApiError);
    await expect(request).rejects.toMatchObject({
      name: "TestObserverApiError",
      status,
      message: `Test Observer request to ${mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL} failed with status ${status}`,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("propagates network failures without retrying", async () => {
    const failure = new TypeError("Connection failed");
    fetcher.mockRejectedValue(failure);

    await expect(getImageArtifacts()).rejects.toBe(failure);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    {},
    null,
    [{ id: 1 }],
    [{ ...artifact(), id: "1" }],
    [{ ...artifact(), archived: "false" }],
    [{ ...artifact(), all_environment_reviews_count: "2" }],
    [artifact(), { id: 2 }],
  ])("rejects malformed API data: %j", async (body) => {
    respondWith(body);

    await expect(getImageArtifacts()).rejects.toBeInstanceOf(v.ValiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("propagates invalid JSON responses", async () => {
    fetcher.mockResolvedValue(new Response("not JSON"));

    await expect(getImageArtifacts()).rejects.toBeInstanceOf(SyntaxError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("image queries", () => {
  it.each(["", undefined])(
    "uses fixture images and counts when the endpoint is %j",
    async (endpoint) => {
      const url = mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL;
      mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL = endpoint;
      const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        vi.resetModules();
        const { getImages, getImageCounts } = await import("./client.js");
        expect(warning).toHaveBeenCalledTimes(1);
        await expect(getImages("resolute")).resolves.toEqual({
          items: imagesFixture,
          total: 6,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        });
        await expect(getImageCounts("resolute")).resolves.toEqual({
          total: 6,
          building: { total: 6, successful: 4, failed: 1, running: 1 },
          testing: { total: 4, passed: 1, failed: 2, running: 1 },
        });
        const sorted = await getImages("resolute", {
          testStatus: "failed",
          sortKey: "image-name",
          sortOrder: "descending",
          page: 99,
        });
        expect(sorted.items.map((image) => image.id)).toEqual([1005, 1003]);
        expect(sorted).toMatchObject({ total: 2, page: 1, totalPages: 1 });
        await expect(
          getImageCounts("resolute", { testStatus: "failed" }),
        ).resolves.toMatchObject({ total: 2, testing: { failed: 2 } });
        await expect(getImages("other")).resolves.toMatchObject({
          items: [],
          total: 0,
        });
        expect((await getImages("resolute")).items).toEqual(imagesFixture);
        expect(imagesFixture.map((image) => image.id)).toEqual([
          1001, 1002, 1003, 1004, 1005, 1006,
        ]);
        expect(fetcher).not.toHaveBeenCalled();
        expect(warning).toHaveBeenCalledWith(
          "TEST_OBSERVER_IMAGE_ARTIFACTS_URL is not configured; using fixture image data",
        );
        expect(warning).toHaveBeenCalledTimes(1);
      } finally {
        mockEnv.TEST_OBSERVER_IMAGE_ARTIFACTS_URL = url;
      }
    },
  );

  it("does not warn on module initialization when the endpoint is configured", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.resetModules();
    const { getImages, getImageCounts } = await import("./client.js");
    respondWith([artifact()]);
    await getImages("resolute");
    await getImageCounts("resolute");
    expect(warning).not.toHaveBeenCalled();
  });

  it("does not substitute fixtures when the configured API fails", async () => {
    respondWith({}, 503);
    await expect(getImages("resolute")).rejects.toBeInstanceOf(
      TestObserverApiError,
    );
    await expect(getImageCounts("resolute")).rejects.toBeInstanceOf(
      TestObserverApiError,
    );
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("paginates and counts cached images without refetching", async () => {
    respondWith(
      Array.from({ length: 12 }, (_, index) => artifact({ id: index + 1 })),
    );
    const first = await getImages("resolute");
    const second = await getImages("resolute", { page: 2 });
    expect(first.items.map((image) => image.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(second.items.map((image) => image.id)).toEqual([11, 12]);
    expect(second).toMatchObject({
      total: 12,
      page: 2,
      pageSize: 10,
      totalPages: 2,
    });
    await expect(getImageCounts("resolute")).resolves.toMatchObject({
      total: 12,
      building: { failed: 12 },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("filters before paging and sorts without mutating the cache", async () => {
    respondWith([
      artifact({ id: 1, version: "2" }),
      artifact({ id: 2, version: "10" }),
      artifact({ id: 3, release: "other" }),
      artifact({ id: 4, os: "kubuntu" }),
    ]);
    const sorted = await getImages("resolute", {
      product: "ubuntu",
      sortKey: "version",
      sortOrder: "descending",
    });
    expect(sorted.items.map((image) => image.id)).toEqual([2, 1]);
    const unsorted = await getImages("resolute", {
      product: "ubuntu",
      page: 99,
    });
    expect(unsorted.items.map((image) => image.id)).toEqual([1, 2]);
    expect(unsorted.page).toBe(1);
    await expect(
      getImageCounts("resolute", { product: "ubuntu" }),
    ).resolves.toMatchObject({ total: 2 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
