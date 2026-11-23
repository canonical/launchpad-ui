import type { FilterTextPart } from "#lib/modules/filtering/representation.js";

export type GroupProps<TFilters extends object> = {
  parts: FilterTextPart<TFilters>[];
};
