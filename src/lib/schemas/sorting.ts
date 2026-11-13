import * as v from "valibot";

export function createSortingSchema<const TColumns extends v.PicklistOptions>(
  columns: TColumns,
) {
  return v.object({
    sortKey: v.nullable(v.picklist(columns)),
    sortOrder: v.picklist(["ascending", "descending", "none"]),
  });
}
