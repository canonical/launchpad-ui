import type { SourcePackagePublishingHistoryFull } from "@canonical/launchpad-client/schemas/models/source_package_publishing_history";
import type { FilterRepresentationConfig } from "#lib/modules/filtering/representation.js";
import type { PackagesFilters } from "./schema.js";

export const MAX_PACKAGES_SEARCH_LENGTH = 200;
export const MORE_FILTERS_LABEL = "More filters";

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

export const PACKAGES_FILTER_REPRESENTATION = {
  match: { label: "Search mode", text: () => null },
  search: {
    label: "Keyword",
    text: (search, { match }) => [SEARCH_MODE_LABELS[match], `"${search}"`],
    shortText: (search) => `"${search}"`,
  },
  maintainer: { label: "Maintained by" },
  signer: { label: "Signed by" },
  series: {
    label: "Series",
    shortText: (series) => series,
  },
  pocket: { label: "Pocket", shortText: (pocket) => pocket },
  ubuntuChange: {
    label: "Only show packages changed by Ubuntu",
    text: (enabled) => (enabled ? "Changed by Ubuntu" : null),
  },
  allStatuses: {
    label: "Include Superseded and Deleted",
    text: (enabled) => (enabled ? "All statuses" : null),
  },
} satisfies FilterRepresentationConfig<PackagesFilters>;

export const DEFAULT_PACKAGES_FILTERS = {
  search: undefined,
  match: "contains",
  series: undefined,
  pocket: undefined,
  maintainer: undefined,
  signer: undefined,
  ubuntuChange: false,
  allStatuses: false,
} as const satisfies PackagesFilters;
