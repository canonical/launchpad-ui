import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "$lib/server/test-observer/client";
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

vi.mock("$lib/server/test-observer/client", () => ({
  getUbuntuImages: vi.fn(),
  getUbuntuImageCounts: vi.fn(),
}));

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

describe("series image queries", () => {
  describe("applies the series images query schema", () => {
    it("checks parameters to have the correct structure", async () => {
      await getSeriesImages({ ...queryArgs, ...filters, page: 3 });
      await getSeriesImageCounts({ ...queryArgs, ...filters });

      expect(getUbuntuImages).toHaveBeenCalledWith("resolute", {
        ...filters,
        page: 3,
        sortOrder: undefined,
        sortKey: undefined,
      });
      expect(getUbuntuImageCounts).toHaveBeenCalledWith("resolute", filters);
    });

    it("detects when filter parameters do not have the correct structure", async () => {
      const invalidFilters = { ...filters, buildStatus: "invalid" };
      await expect(
        getSeriesImages({ ...queryArgs, ...invalidFilters, page: 3.5 }),
      ).rejects.toBeInstanceOf(v.ValiError);
      await expect(
        getSeriesImageCounts({ ...queryArgs, ...invalidFilters }),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getUbuntuImages).not.toHaveBeenCalled();
      expect(getUbuntuImageCounts).not.toHaveBeenCalled();
    });

    it("detects when paging parameters do not have the correct structure", async () => {
      await expect(
        getSeriesImages({ ...queryArgs, ...filters, page: 3.5 }),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getUbuntuImages).not.toHaveBeenCalled();
    });
  });

  it("passes all parameters to getUbuntuImages and getUbuntuImageCounts for Ubuntu", async () => {
    const parameters = {
      ...filters,
      page: 3,
      sortKey: "version",
      sortOrder: "descending",
    } as const;

    await getSeriesImages({ ...queryArgs, ...parameters });
    await getSeriesImageCounts({ ...queryArgs, ...filters });

    expect(getUbuntuImages).toHaveBeenCalledExactlyOnceWith(
      "resolute",
      parameters,
    );
    expect(getUbuntuImageCounts).toHaveBeenCalledExactlyOnceWith(
      "resolute",
      filters,
    );
  });

  it("returns null without calling getUbuntuImages or getUbuntuImageCounts for other distributions", async () => {
    await expect(
      getSeriesImages({ pillar: "debian", series: "sid" }),
    ).resolves.toBeNull();
    await expect(
      getSeriesImageCounts({ pillar: "debian", series: "sid" }),
    ).resolves.toBeNull();
    expect(getUbuntuImages).not.toHaveBeenCalled();
    expect(getUbuntuImageCounts).not.toHaveBeenCalled();
  });

  it("logs provider errors and throws a 503", async () => {
    const failure = new Error("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getUbuntuImages).mockRejectedValue(failure);
    vi.mocked(getUbuntuImageCounts).mockRejectedValue(failure);

    await expect(getSeriesImages(queryArgs)).rejects.toMatchObject({
      status: 503,
      body: { message: "Couldn't load images. Try again shortly." },
    });
    await expect(getSeriesImageCounts(queryArgs)).rejects.toMatchObject({
      status: 503,
      body: { message: "Couldn't load image counts. Try again shortly." },
    });
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenCalledWith("Failed to load series images", failure);
    expect(log).toHaveBeenCalledWith(
      "Failed to load series image counts",
      failure,
    );
  });
});
