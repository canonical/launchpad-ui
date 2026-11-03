import type { SourcePackagePublishingHistoryFull } from "@canonical/launchpad-client/schemas/models/source_package_publishing_history";
import type { PackagesFilters } from "./schema.js";

export const MAX_PACKAGES_SEARCH_LENGTH = 200;

export const SEARCH_MATCHES = ["contains", "exact"] as const;
export type SearchMatch = (typeof SEARCH_MATCHES)[number];

export const SEARCH_MODE_LABELS = {
  contains: "Contain",
  exact: "Exact Match",
} as const satisfies Record<SearchMatch, string>;

export const POCKETS = [
  "Release",
  "Security",
  "Updates",
  "Proposed",
  "Backports",
] as const satisfies readonly SourcePackagePublishingHistoryFull["pocket"][];

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

type BooleanFilterKey = {
  [K in keyof PackagesFilters]: PackagesFilters[K] extends boolean ? K : never;
}[keyof PackagesFilters];

export const PACKAGES_FILTER_SUMMARY_LABELS = {
  ubuntuChange: "Changed by Ubuntu",
  allStatuses: "All statuses",
} as const satisfies Record<BooleanFilterKey, string>;

export const DEFAULT_PACKAGES_FILTERS = {
  search: null,
  match: "contains",
  series: null,
  pocket: null,
  maintainer: null,
  signer: null,
  ubuntuChange: false,
  allStatuses: false,
} as const satisfies PackagesFilters;
