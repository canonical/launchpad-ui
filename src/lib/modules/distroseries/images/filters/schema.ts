import * as v from "valibot";
import { nullIfEmpty } from "#lib/modules/filtering/schema.ts";
import { BUILD_STATUSES, PRODUCTS, TEST_STATUSES } from "../constants";

const ImageFilterFields = {
  product: v.picklist(PRODUCTS.map((product) => product.slug)),
  buildStatus: v.picklist(BUILD_STATUSES),
  testStatus: v.picklist(TEST_STATUSES),
};

/** Parses form-shaped image filters */
export const ImagesFiltersSchema = v.object({
  product: nullIfEmpty(ImageFilterFields.product),
  buildStatus: nullIfEmpty(ImageFilterFields.buildStatus),
  testStatus: nullIfEmpty(ImageFilterFields.testStatus),
});

export type ImagesFilters = v.InferOutput<typeof ImagesFiltersSchema>;

/** Parses API-shaped image filters */
export const ParsedImagesFiltersSchema = v.object({
  product: v.nullable(ImageFilterFields.product),
  buildStatus: v.nullable(ImageFilterFields.buildStatus),
  testStatus: v.nullable(ImageFilterFields.testStatus),
});
