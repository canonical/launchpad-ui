import { slugify } from "$lib/utils/slugify.js";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
import type { PackagesFilters } from "../filters/schema.js";

export const MAX_TABLE_VIEW_NAME_LENGTH = 100;

export type TableView = {
  id: string;
  name: string;
  slug: string;
  editable: boolean;
  filters: PackagesFilters;
};

export const DEFAULT_TABLE_VIEWS: TableView[] = [
  {
    id: "all-packages",
    name: "All packages",
    editable: false,
    filters: DEFAULT_PACKAGES_FILTERS,
  },
  {
    id: "resolute-packages",
    name: "Resolute packages",
    editable: true,
    filters: { ...DEFAULT_PACKAGES_FILTERS, series: "resolute" },
  },
].map(({ id, name, editable, filters }) => ({
  id,
  name,
  slug: slugify(name),
  editable,
  filters,
}));

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS[0].slug;
