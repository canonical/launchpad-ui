import * as v from "valibot";
import { BUILD_STATUSES, PRODUCTS, TEST_STATUSES } from "../constants.js";

/** Parses API-shaped image filters */
export const ParsedImagesFiltersSchema = v.object({
  product: v.picklist(PRODUCTS.map((product) => product.slug)),
  buildStatus: v.picklist(BUILD_STATUSES),
  testStatus: v.picklist(TEST_STATUSES),
});
