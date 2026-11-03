import { error } from "@sveltejs/kit";
import { getImageCounts, getImages } from "$lib/server/test-observer/client";
import {
  getSeriesImageCountsArgsSchema,
  getSeriesImagesArgsSchema,
} from "./schema";
import { query } from "$app/server";

export const getSeriesImages = query(
  getSeriesImagesArgsSchema,
  async ({ pillar, series, ...rest }) => {
    if (pillar !== "ubuntu")
      return { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };

    try {
      return await getImages(series, rest);
    } catch (requestError) {
      console.error("Failed to load series images", requestError);
      error(503, "Couldn't load images. Try again shortly.");
    }
  },
);

export const getSeriesImageCounts = query(
  getSeriesImageCountsArgsSchema,
  async ({ pillar, series, ...rest }) => {
    if (pillar !== "ubuntu")
      return {
        total: 0,
        building: { total: 0, successful: 0, failed: 0, running: 0 },
        testing: { total: 0, passed: 0, failed: 0, running: 0 },
      };

    try {
      return await getImageCounts(series, rest);
    } catch (requestError) {
      console.error("Failed to load series image counts", requestError);
      error(503, "Couldn't load image counts. Try again shortly.");
    }
  },
);
