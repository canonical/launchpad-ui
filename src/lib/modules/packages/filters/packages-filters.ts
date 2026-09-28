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

/** Called when a filter control picks a new value. */
export type FilterChangeHandler<T> = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
  value: T,
) => void;
