import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { SORT_DIRECTIONS } from "$lib/codecs/sortCodec";
import {
  getUbuntuImageCounts,
  getUbuntuImages,
} from "$lib/server/test-observer/client";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName";
import { SORTABLE_IMAGES_TABLE_COLUMNS } from "./constants";
import { ParsedImagesFiltersSchema } from "./filters/schema";
import { query } from "$app/server";

/**
 * Remote function schemas
 */
const nameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));
const getSeriesImagesArgsSchema = v.intersect([
  v.object({
    pillar: nameSchema,
    series: nameSchema,
    sortKey: v.nullable(v.picklist(SORTABLE_IMAGES_TABLE_COLUMNS)),
    sortOrder: v.nullable(v.picklist(SORT_DIRECTIONS)),
    page: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(1), v.safeInteger()),
      1,
    ),
  }),
  v.partial(ParsedImagesFiltersSchema),
]);
const getSeriesImageCountsArgsSchema = v.intersect([
  v.object({ pillar: nameSchema, series: nameSchema }),
  v.partial(ParsedImagesFiltersSchema),
]);

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
