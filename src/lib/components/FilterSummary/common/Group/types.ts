import type { FilterTextPart } from "#lib/filter/index.js";

export type GroupProps<TFilters extends object> = {
  parts: FilterTextPart<TFilters>[];
};
