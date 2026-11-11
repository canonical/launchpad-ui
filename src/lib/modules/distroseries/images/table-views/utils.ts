import { MAX_TABLE_VIEW_NAME_LENGTH } from "#lib/modules/table-views/constants.ts";
import { PRODUCTS } from "../constants";
import type { ImagesFilters } from "../filters/schema";

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Suggests a view name describing the given filters, e.g. `Ubuntu Core + Build status: Failed`.
 * Returns an empty string when no filters are set.
 */
export function getRecommendedViewName(filters: ImagesFilters): string {
  const parts = [
    filters.product &&
      PRODUCTS.find(({ slug }) => slug === filters.product)?.name,
    filters.buildStatus && capitalize(filters.buildStatus),
    filters.testStatus && capitalize(filters.testStatus),
  ].filter(Boolean);

  let name = parts.join(" + ");
  if (name.length > MAX_TABLE_VIEW_NAME_LENGTH)
    name = `${name.slice(0, MAX_TABLE_VIEW_NAME_LENGTH - 1)}…`;

  return name;
}
