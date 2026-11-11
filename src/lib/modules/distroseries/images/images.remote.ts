import { error } from "@sveltejs/kit";
import * as v from "valibot";
import {
  createSortingSchema,
  distroSeriesSchema,
  paginationSchema,
} from "#lib/schemas/index.js";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "#lib/server/test-observer/client.js";
import { SORTABLE_IMAGES_TABLE_COLUMNS } from "./constants.js";
import { ParsedImagesFiltersSchema } from "./filters/schema.js";
import { query } from "$app/server";

const getSeriesImagesArgsSchema = v.intersect([
  distroSeriesSchema,
  paginationSchema,
  createSortingSchema(SORTABLE_IMAGES_TABLE_COLUMNS),
  ParsedImagesFiltersSchema,
]);

const getSeriesImageCountsArgsSchema = v.intersect([
  distroSeriesSchema,
  ParsedImagesFiltersSchema,
]);

export const getSeriesImages = query(
  getSeriesImagesArgsSchema,
  async ({ distro, series, sortOrder, sortKey, ...rest }) => {
    if (distro !== "ubuntu") return null;

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
  async ({ distro, series, ...rest }) => {
    if (distro !== "ubuntu") return null;

    try {
      return await getUbuntuImageCounts(series, rest);
    } catch (requestError) {
      console.error("Failed to load series image counts", requestError);
      error(503, "Couldn't load image counts. Try again shortly.");
    }
  },
);
