import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "$lib/server/test-observer/client";
import {
  getSeriesImageCounts,
  getSeriesImageCountsArgsSchema,
  getSeriesImages,
  getSeriesImagesArgsSchema,
} from "./images.remote.js";

const { query } = vi.hoisted(() => ({
  query: vi.fn(
    (_schema: unknown, handler: (args: unknown) => Promise<unknown>) =>
      Object.assign(handler, { __: { type: "query" } }),
  ),
}));

vi.mock("$app/server", () => ({ query }));

vi.mock("$lib/server/test-observer/client", () => ({
  getUbuntuImages: vi.fn(),
  getUbuntuImageCounts: vi.fn(),
}));

const registeredQueries = query.mock.calls.slice();
const queryArgs = { pillar: "ubuntu", series: "resolute" };
const filters = {
  product: "ubuntu-core",
  buildStatus: "successful",
  testStatus: "failed",
} as const;

beforeEach(() => {
  vi.mocked(getUbuntuImages).mockReset();
  vi.mocked(getUbuntuImageCounts).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getSeriesImages", () => {
  it("applies the series images query schema", () => {
    expect(registeredQueries[0]).toEqual([
      getSeriesImagesArgsSchema,
      expect.any(Function),
    ]);
  });

  it("passes all parameters to getUbuntuImages for Ubuntu", async () => {
    const parameters = {
      ...filters,
      page: 3,
      sortKey: "version",
      sortOrder: "descending",
    } as const;

    await getSeriesImages({ ...queryArgs, ...parameters });

    expect(getUbuntuImages).toHaveBeenCalledExactlyOnceWith(
      "resolute",
      parameters,
    );
  });

  it("returns null without calling getUbuntuImages for other distributions", async () => {
    await expect(
      getSeriesImages({ pillar: "debian", series: "sid" }),
    ).resolves.toBeNull();
    expect(getUbuntuImages).not.toHaveBeenCalled();
  });

  it("logs provider errors and throws a 503", async () => {
    const failure = new Error("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getUbuntuImages).mockRejectedValue(failure);

    await expect(getSeriesImages(queryArgs)).rejects.toMatchObject({
      status: 503,
      body: { message: "Couldn't load images. Try again shortly." },
    });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "Failed to load series images",
      failure,
    );
  });
});

describe("getSeriesImageCounts", () => {
  it("applies the series image counts query schema", () => {
    expect(registeredQueries[1]).toEqual([
      getSeriesImageCountsArgsSchema,
      expect.any(Function),
    ]);
  });

  it("passes all parameters to getUbuntuImageCounts for Ubuntu", async () => {
    await getSeriesImageCounts({ ...queryArgs, ...filters });

    expect(getUbuntuImageCounts).toHaveBeenCalledExactlyOnceWith(
      "resolute",
      filters,
    );
  });

  it("returns null without calling getUbuntuImageCounts for other distributions", async () => {
    await expect(
      getSeriesImageCounts({ pillar: "debian", series: "sid" }),
    ).resolves.toBeNull();
    expect(getUbuntuImageCounts).not.toHaveBeenCalled();
  });

  it("logs provider errors and throws a 503", async () => {
    const failure = new Error("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getUbuntuImageCounts).mockRejectedValue(failure);

    await expect(getSeriesImageCounts(queryArgs)).rejects.toMatchObject({
      status: 503,
      body: { message: "Couldn't load image counts. Try again shortly." },
    });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "Failed to load series image counts",
      failure,
    );
  });
});
