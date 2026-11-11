import * as v from "valibot";
import { undefinedIfEmpty } from "#lib/modules/filtering/schema.js";
import { BUILD_STATUSES, PRODUCTS, TEST_STATUSES } from "../constants";

const ImageFilterFields = {
  product: v.picklist(PRODUCTS.map((product) => product.slug)),
  buildStatus: v.picklist(BUILD_STATUSES),
  testStatus: v.picklist(TEST_STATUSES),
};

/** Parses form-shaped image filters */
export const ImagesFiltersSchema = v.object({
  product: undefinedIfEmpty(ImageFilterFields.product),
  buildStatus: undefinedIfEmpty(ImageFilterFields.buildStatus),
  testStatus: undefinedIfEmpty(ImageFilterFields.testStatus),
});

export type ImagesFilters = v.InferOutput<typeof ImagesFiltersSchema>;

/** Parses API-shaped image filters */
export const ParsedImagesFiltersSchema = v.object({
  product: v.undefinedable(ImageFilterFields.product),
  buildStatus: v.undefinedable(ImageFilterFields.buildStatus),
  testStatus: v.undefinedable(ImageFilterFields.testStatus),
});
