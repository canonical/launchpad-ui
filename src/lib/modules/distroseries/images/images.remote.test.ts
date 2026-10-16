import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getImageCounts,
  getImages,
} from "$lib/server/image-provider/client.js";
import { getSeriesImageCounts, getSeriesImages } from "./images.remote.js";

vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock("$lib/server/image-provider/client.js", () => ({
  getImages: vi.fn(),
  getImageCounts: vi.fn(),
}));

const queryArgs = { pillar: "ubuntu", series: "resolute" } as const;

const imagePage = {
  items: [
    {
      id: 1,
      product: "ubuntu",
      name: "resolute-desktop-amd64.iso",
      buildStatus: "successful" as const,
      testStatus: "passed" as const,
      bugs: [],
      version: "20261016",
      url: "https://example.com/resolute-desktop-amd64.iso",
      fileSize: 1_000_000_000,
      series: "resolute",
    },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const imageCounts = {
  total: 6,
  building: { total: 6, successful: 4, failed: 1, running: 1 },
  testing: { total: 4, passed: 1, failed: 2, running: 1 },
};

beforeEach(() => {
  vi.mocked(getImages).mockReset().mockResolvedValue(imagePage);
  vi.mocked(getImageCounts).mockReset().mockResolvedValue(imageCounts);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("series image queries", () => {
  it("passes the same filters to rows and counts, with pagination and sorting only for rows", async () => {
    const filters = {
      product: "ubuntu-core",
      buildStatus: "successful",
      testStatus: "failed",
    } as const;

    await getSeriesImages({
      ...queryArgs,
      ...filters,
      page: 3,
      sortKey: "version",
      sortOrder: "descending",
    });
    await getSeriesImageCounts({ ...queryArgs, ...filters });

    expect(getImages).toHaveBeenCalledExactlyOnceWith("resolute", {
      ...filters,
      page: 3,
      sortKey: "version",
      sortOrder: "descending",
    });
    expect(getImageCounts).toHaveBeenCalledExactlyOnceWith("resolute", filters);
  });

  it("applies default pagination and sorting when options are omitted", async () => {
    await getSeriesImages(queryArgs);
    await getSeriesImageCounts(queryArgs);

    expect(getImages).toHaveBeenCalledExactlyOnceWith("resolute", {
      page: 1,
      sortKey: null,
      sortOrder: "none",
    });
    expect(getImageCounts).toHaveBeenCalledExactlyOnceWith("resolute", {});
  });

  it("accepts null filters for both rows and counts", async () => {
    const filters = { product: null, buildStatus: null, testStatus: null };
    await getSeriesImages({ ...queryArgs, ...filters });
    await getSeriesImageCounts({ ...queryArgs, ...filters });

    expect(getImages).toHaveBeenCalledWith("resolute", {
      ...filters,
      page: 1,
      sortKey: null,
      sortOrder: "none",
    });
    expect(getImageCounts).toHaveBeenCalledWith("resolute", filters);
  });

  it("returns the provider's rows and counts unchanged", async () => {
    await expect(getSeriesImages(queryArgs)).resolves.toEqual(imagePage);
    await expect(getSeriesImageCounts(queryArgs)).resolves.toEqual(imageCounts);
  });

  it.each([
    ["image-name", "ascending"],
    ["image-name", "descending"],
    ["version", "ascending"],
    ["version", "descending"],
    [null, "none"],
  ] as const)(
    "forwards sort key %s and direction %s",
    async (sortKey, sortOrder) => {
      await getSeriesImages({ ...queryArgs, sortKey, sortOrder });

      expect(getImages).toHaveBeenCalledWith("resolute", {
        page: 1,
        sortKey,
        sortOrder,
      });
    },
  );

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, "2", null])(
    "rejects invalid page %s before calling the provider",
    async (page) => {
      await expect(
        getSeriesImages({ ...queryArgs, page } as never),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getImages).not.toHaveBeenCalled();
    },
  );

  it.each([{ sortKey: "invalid" }, { sortOrder: "invalid" }])(
    "rejects invalid sorting options %j before calling the provider",
    async (options) => {
      await expect(
        getSeriesImages({ ...queryArgs, ...options } as never),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getImages).not.toHaveBeenCalled();
    },
  );
});

describe.each([
  {
    label: "series images",
    query: getSeriesImages,
    provider: getImages,
    logMessage: "Failed to load series images",
    errorMessage: "Couldn't load images. Try again shortly.",
  },
  {
    label: "series image counts",
    query: getSeriesImageCounts,
    provider: getImageCounts,
    logMessage: "Failed to load series image counts",
    errorMessage: "Couldn't load image counts. Try again shortly.",
  },
])("$label query errors", ({ query, provider, logMessage, errorMessage }) => {
  it("uses a SvelteKit 404 for distributions other than Ubuntu", async () => {
    await expect(
      query({ pillar: "debian", series: "sid" }),
    ).rejects.toMatchObject({
      status: 404,
      body: { message: "Images are only available for Ubuntu series" },
    });
    expect(provider).not.toHaveBeenCalled();
  });

  it("logs provider failures and raises a SvelteKit 503", async () => {
    const failure = new TypeError("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(provider).mockRejectedValue(failure);

    await expect(query(queryArgs)).rejects.toMatchObject({
      status: 503,
      body: { message: errorMessage },
    });
    expect(log).toHaveBeenCalledExactlyOnceWith(logMessage, failure);
    expect(provider).toHaveBeenCalledTimes(1);
  });
});
