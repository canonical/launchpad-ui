import * as v from "valibot";
import { BUILD_STATUSES, PRODUCTS, TEST_STATUSES } from "../constants.js";

const ImageFilterFields = {
  product: v.picklist(PRODUCTS.map((product) => product.slug)),
  buildStatus: v.picklist(BUILD_STATUSES),
  testStatus: v.picklist(TEST_STATUSES),
};

/** Parses API-shaped image filters */
export const ParsedImagesFiltersSchema = v.object({
  product: ImageFilterFields.product,
  buildStatus: ImageFilterFields.buildStatus,
  testStatus: v.nullable(ImageFilterFields.testStatus),
});
