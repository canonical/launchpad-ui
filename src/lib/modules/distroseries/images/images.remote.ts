import { error } from "@sveltejs/kit";
import {
  getImageCounts,
  getImages,
} from "$lib/server/image-provider/client.js";
import {
  getSeriesImageCountsArgsSchema,
  getSeriesImagesArgsSchema,
} from "./schema";
import { query } from "$app/server";

export const getSeriesImages = query(
  getSeriesImagesArgsSchema,
  async ({ pillar, series, ...rest }) => {
    if (pillar !== "ubuntu")
      error(404, "Images are only available for Ubuntu series");

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
      error(404, "Images are only available for Ubuntu series");

    try {
      return await getImageCounts(series, rest);
    } catch (requestError) {
      console.error("Failed to load series image counts", requestError);
      error(503, "Couldn't load image counts. Try again shortly.");
    }
  },
);
