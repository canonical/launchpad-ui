import {
  PACKAGES_FILTER_LABELS,
  PACKAGES_FILTER_SUMMARY_LABELS,
} from "../filters/constants.js";
import type { PackagesFilters } from "../filters/schema.js";
import { MAX_TABLE_VIEW_NAME_LENGTH } from "./constants.js";

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Suggests a view name describing the given filters, e.g. `"lib" + Resolute + Changed by Ubuntu`.
 * Returns an empty string when no filters are set.
 */
export function getRecommendedViewName(filters: PackagesFilters): string {
  const parts = [
    filters.search && `"${filters.search}"`,
    filters.series && capitalize(filters.series),
    filters.pocket,
    filters.maintainer &&
      `${PACKAGES_FILTER_LABELS.maintainer} ${filters.maintainer}`,
    filters.signer && `${PACKAGES_FILTER_LABELS.signer} ${filters.signer}`,
    filters.ubuntuChange && PACKAGES_FILTER_SUMMARY_LABELS.ubuntuChange,
    filters.allStatuses && PACKAGES_FILTER_SUMMARY_LABELS.allStatuses,
  ].filter(Boolean);

  let name = parts.join(" + ");
  if (name.length > MAX_TABLE_VIEW_NAME_LENGTH)
    name = `${name.slice(0, MAX_TABLE_VIEW_NAME_LENGTH - 1)}…`;

  return name;
}
