import { slugify } from "#lib/utils/index.ts";
import { DEFAULT_IMAGES_FILTERS } from "../filters/constants.js";
import type { ImagesFilters } from "../filters/schema.js";

export const DEFAULT_TABLE_VIEW_ID = "all-images";

export type TableView = {
  id: string;
  name: string;
  slug: string;
  editable: boolean;
  filters: ImagesFilters;
};

export const DEFAULT_TABLE_VIEWS: TableView[] = [
  {
    id: DEFAULT_TABLE_VIEW_ID,
    name: "All images",
    editable: false,
    filters: DEFAULT_IMAGES_FILTERS,
  },
  {
    id: "failed-to-build",
    name: "Failed to build",
    editable: true,
    filters: {
      ...DEFAULT_IMAGES_FILTERS,
      buildStatus: "failed",
    } satisfies ImagesFilters,
  },
  {
    id: "failed-testing",
    name: "Failed testing",
    editable: true,
    filters: {
      ...DEFAULT_IMAGES_FILTERS,
      testStatus: "failed",
    } satisfies ImagesFilters,
  },
].map(({ id, name, editable, filters }) => ({
  id,
  name,
  slug: slugify(name),
  editable,
  filters,
}));

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS.find(
  ({ id }) => id === DEFAULT_TABLE_VIEW_ID,
)!.slug;
