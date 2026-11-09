import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageArtifact } from "./types.js";

// TODO: Reduce repeated env mocks (https://warthogs.atlassian.net/browse/LP-5132)
vi.mock(
  "$app/env/private",
  () =>
    ({
      TEST_OBSERVER_IMAGE_ARTIFACTS_URL:
        "https://observer.example/v1/artefacts?family=image",
    }) satisfies Partial<typeof import("$app/env/private")>,
);

const IMAGE_ARTIFACTS_URL =
  "https://observer.example/v1/artefacts?family=image";

const imageArtifact: ImageArtifact = {
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
};

const fetcher = vi.fn<typeof fetch>();
let client: typeof import("./client.js");

beforeEach(async () => {
  vi.resetModules();
  fetcher.mockReset();
  fetcher.mockResolvedValue(Response.json([imageArtifact]));
  vi.stubGlobal("fetch", fetcher);
  client = await import("./client.js");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getImageArtifacts", () => {
  it("fetches artifacts, respecting the response schema", async () => {
    fetcher.mockResolvedValue(
      Response.json([{ ...imageArtifact, reviewers: [] }]),
    );

    await expect(client.getImageArtifacts()).resolves.toEqual([imageArtifact]);
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(IMAGE_ARTIFACTS_URL, {
      headers: { accept: "application/json" },
    });
  });

  it("rejects data that does not match the artifact schema", async () => {
    fetcher.mockResolvedValue(Response.json([{ id: 1 }]));

    await expect(client.getImageArtifacts()).rejects.toBeInstanceOf(
      v.ValiError,
    );
  });

  it.each(["empty", "expired"])(
    "shares concurrent requests when the cache is %s and caches the result",
    async (cacheState) => {
      vi.useFakeTimers();

      if (cacheState === "expired") {
        await client.getImageArtifacts();
        vi.advanceTimersByTime(10 * 60_000);
      }

      const expectedFetches = cacheState === "expired" ? 2 : 1;
      fetcher.mockResolvedValueOnce(Response.json([]));

      // Start all calls before allowing asynchronous work to finish.
      const requests = Array.from({ length: 3 }, () =>
        client.getImageArtifacts(),
      );

      expect(fetcher).toHaveBeenCalledTimes(expectedFetches);

      await expect(Promise.all(requests)).resolves.toEqual([[], [], []]);

      // The completed request should remain cached.
      await expect(client.getImageArtifacts()).resolves.toEqual([]);
      expect(fetcher).toHaveBeenCalledTimes(expectedFetches);
    },
  );

  it("propagates network failures without caching them", async () => {
    const failure = new TypeError("Connection failed");
    fetcher.mockRejectedValueOnce(failure);

    await expect(client.getImageArtifacts()).rejects.toBe(failure);
    await expect(client.getImageArtifacts()).resolves.toEqual([imageArtifact]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("propagates invalid JSON errors", async () => {
    fetcher.mockResolvedValue(new Response("not JSON"));

    await expect(client.getImageArtifacts()).rejects.toBeInstanceOf(
      SyntaxError,
    );
  });

  it("propagates API errors", async () => {
    fetcher.mockResolvedValue(Response.json({}, { status: 503 }));

    await expect(client.getImageArtifacts()).rejects.toMatchObject({
      name: "TestObserverApiError",
      status: 503,
      message: `Test Observer request to ${IMAGE_ARTIFACTS_URL} failed with status 503`,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("getUbuntuImages", () => {
  it("maps artifacts to paginated series images", async () => {
    await expect(client.getUbuntuImages("resolute")).resolves.toEqual({
      items: [
        {
          id: 1,
          product: "ubuntu",
          name: imageArtifact.name,
          buildStatus: "<not defined>",
          testStatus: "<not defined>",
          bugs: "<not defined>",
          version: imageArtifact.version,
          url: imageArtifact.image_url,
          fileSize: "<not defined>",
          series: "resolute",
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });
  });

  it("filters before pagination", async () => {
    fetcher.mockResolvedValue(
      Response.json([
        ...Array.from({ length: 10 }, (_, index) => ({
          ...imageArtifact,
          id: index + 1,
          release: index % 2 === 0 ? "other" : "resolute",
          os: "kubuntu",
        })),
        { ...imageArtifact, id: 11 },
        { ...imageArtifact, id: 12 },
      ]),
    );

    const images = await client.getUbuntuImages("resolute", {
      product: "ubuntu",
    });

    expect(images.items.map((image) => image.id)).toEqual([11, 12]);
    expect(images).toMatchObject({ total: 2, page: 1, size: 10 });
  });

  it("sorts before pagination", async () => {
    fetcher.mockResolvedValue(
      Response.json(
        Array.from({ length: 12 }, (_, index) => ({
          ...imageArtifact,
          id: index + 1,
          version: String(index + 1),
        })),
      ),
    );

    const images = await client.getUbuntuImages("resolute", {
      sortKey: "version",
      sortOrder: "descending",
      page: 2,
    });

    expect(images.items.map((image) => image.id)).toEqual([2, 1]);
    expect(images).toMatchObject({ total: 12, page: 2, size: 10 });
  });

  it("returns an empty page when no images match", async () => {
    await expect(client.getUbuntuImages("other")).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      size: 10,
    });
  });

  it.each(["buildStatus", "testStatus"] as const)(
    "excludes images with unavailable %s when filtering by status",
    async (statusField) => {
      await expect(
        client.getUbuntuImages("resolute", { [statusField]: "failed" }),
      ).resolves.toEqual({
        items: [],
        total: 0,
        page: 1,
        size: 10,
      });
    },
  );

  it("propagates provider errors", async () => {
    const failure = new Error("Connection failed");
    fetcher.mockRejectedValue(failure);

    await expect(client.getUbuntuImages("resolute")).rejects.toBe(failure);
  });
});

describe("getUbuntuImageCounts", () => {
  it("counts images matching the series and filters", async () => {
    fetcher.mockResolvedValue(
      Response.json([
        imageArtifact,
        { ...imageArtifact, id: 2, release: "other" },
        { ...imageArtifact, id: 3, os: "kubuntu" },
      ]),
    );

    await expect(
      client.getUbuntuImageCounts("resolute", {
        product: "ubuntu",
      }),
    ).resolves.toEqual({
      total: 1,
      building: { total: 0, successful: 0, failed: 0, running: 0 },
      testing: { total: 0, passed: 0, failed: 0, running: 0 },
    });
  });

  it("returns zero counts when no images match", async () => {
    await expect(
      client.getUbuntuImageCounts("resolute", { testStatus: "failed" }),
    ).resolves.toEqual({
      total: 0,
      building: { total: 0, successful: 0, failed: 0, running: 0 },
      testing: { total: 0, passed: 0, failed: 0, running: 0 },
    });
  });

  it("propagates provider errors", async () => {
    const failure = new Error("Connection failed");
    fetcher.mockRejectedValue(failure);

    await expect(client.getUbuntuImageCounts("resolute")).rejects.toBe(failure);
  });
});
