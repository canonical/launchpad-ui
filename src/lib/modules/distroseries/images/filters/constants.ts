import type { ImagesFilters } from "./schema";

export const DEFAULT_IMAGES_FILTERS = {
  product: undefined,
  buildStatus: undefined,
  testStatus: undefined,
} as const satisfies ImagesFilters;

export const IMAGES_FILTER_LABELS = {
  product: "Product",
  buildStatus: "Build status",
  testStatus: "Test status",
} as const;
