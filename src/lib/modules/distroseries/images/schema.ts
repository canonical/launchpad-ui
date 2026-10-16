import * as v from "valibot";
import { SORT_DIRECTIONS } from "$lib/codecs";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName";
import {
  BUILD_STATUSES,
  PRODUCTS,
  SORTABLE_IMAGES_TABLE_COLUMNS,
  TEST_STATUSES,
} from "./constants";

export const imageFiltersSchema = v.object({
  product: v.nullish(v.picklist(PRODUCTS.map((product) => product.slug))),
  buildStatus: v.nullish(v.picklist(BUILD_STATUSES)),
  testStatus: v.nullish(v.picklist(TEST_STATUSES)),
});

export const nameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

export const getSeriesImagesArgsSchema = v.intersect([
  v.object({
    pillar: nameSchema,
    series: nameSchema,
    sortKey: v.nullish(v.picklist(SORTABLE_IMAGES_TABLE_COLUMNS), null),
    sortOrder: v.optional(v.picklist(SORT_DIRECTIONS), "none"),
    page: v.optional(
      v.pipe(v.number(), v.integer(), v.minValue(1), v.safeInteger()),
      1,
    ),
  }),
  imageFiltersSchema,
]);

export const getSeriesImageCountsArgsSchema = v.intersect([
  v.object({ pillar: nameSchema, series: nameSchema }),
  imageFiltersSchema,
]);
