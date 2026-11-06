import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "#lib/server/test-observer/client.ts";
import { getSeriesImageCounts, getSeriesImages } from "./images.remote";

vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock("#lib/server/test-observer/client", () => ({
  getUbuntuImages: vi.fn(),
  getUbuntuImageCounts: vi.fn(),
}));

const regularParams = { distro: "ubuntu", series: "resolute" } as const;

const filters = {
  product: "ubuntu-core",
  buildStatus: "successful",
  testStatus: "failed",
} as const;

const queryArgs = {
  ...regularParams,
  ...filters,
  sortOrder: "ascending",
  sortKey: null,
  page: 1,
  size: 10,
} as const;
const countQueryArgs = {
  ...regularParams,
  ...filters,
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
      await getSeriesImages(queryArgs);
      await getSeriesImageCounts(countQueryArgs);

      expect(getUbuntuImages).toHaveBeenCalledWith("resolute", {
        ...filters,
        sortOrder: "ascending",
        page: 1,
        size: 10,
      });
      expect(getUbuntuImageCounts).toHaveBeenCalledWith("resolute", filters);
    });

    it("detects when paging args do not have the correct structure", async () => {
      await expect(
        getSeriesImages({
          ...queryArgs,
          page: 3.5,
        }),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getUbuntuImages).not.toHaveBeenCalled();
    });

    it("detects when series or pillar args parameters do not have the correct structure", async () => {
      const incorrectArgs = {
        distro: "Ubuntu",
        series: "noble'[]#@@!",
      };
      await expect(
        getSeriesImages({
          ...queryArgs,
          ...incorrectArgs,
        }),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getUbuntuImages).not.toHaveBeenCalled();
      await expect(
        getSeriesImageCounts({
          ...countQueryArgs,
          ...incorrectArgs,
        }),
      ).rejects.toBeInstanceOf(v.ValiError);
      expect(getUbuntuImageCounts).not.toHaveBeenCalled();
    });
  });

  it("returns null without calling getUbuntuImages or getUbuntuImageCounts for other distributions", async () => {
    await expect(
      getSeriesImages({ ...queryArgs, distro: "ubuntu-core" }),
    ).resolves.toBeNull();
    await expect(
      getSeriesImageCounts({ ...countQueryArgs, distro: "ubuntu-core" }),
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
