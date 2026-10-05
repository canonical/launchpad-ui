import type { PackagesFilters } from "./schema.js";

export const MAX_PACKAGES_SEARCH_LENGTH = 200;

export const PACKAGES_FILTER_LABELS = {
  match: "Search mode",
  search: "Keyword",
  maintainer: "Maintained by",
  signer: "Signed by",
  series: "Series",
  pocket: "Pocket",
  moreFilters: "More filters",
  ubuntuChange: "Only show packages changed by Ubuntu",
  allStatuses: "Include Superseded and Deleted",
} as const;

export const DEFAULT_PACKAGES_FILTERS: PackagesFilters = {
  search: null,
  match: "contains",
  series: null,
  pocket: null,
  maintainer: null,
  signer: null,
  ubuntuChange: false,
  allStatuses: false,
};
