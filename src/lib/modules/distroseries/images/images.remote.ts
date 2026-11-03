import { error } from "@sveltejs/kit";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "$lib/server/test-observer/client";
import {
  getSeriesImageCountsArgsSchema,
  getSeriesImagesArgsSchema,
} from "./schema";
import { query } from "$app/server";

export const getSeriesImages = query(
  getSeriesImagesArgsSchema,
  async ({ pillar, series, sortOrder, sortKey, ...rest }) => {
    if (pillar !== "ubuntu") return null;

    try {
      return await getUbuntuImages(series, {
        sortOrder: sortOrder === "none" ? undefined : sortOrder,
        sortKey: sortKey === null ? undefined : sortKey,
        ...rest,
      });
    } catch (requestError) {
      console.error("Failed to load series images", requestError);
      error(503, "Couldn't load images. Try again shortly.");
    }
  },
);

export const getSeriesImageCounts = query(
  getSeriesImageCountsArgsSchema,
  async ({ pillar, series, ...rest }) => {
    if (pillar !== "ubuntu") return null;

    try {
      return await getUbuntuImageCounts(series, rest);
    } catch (requestError) {
      console.error("Failed to load series image counts", requestError);
      error(503, "Couldn't load image counts. Try again shortly.");
    }
  },
);
