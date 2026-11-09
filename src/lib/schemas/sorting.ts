import * as v from "valibot";

export const createSortingSchema = <const TColumns extends v.PicklistOptions>(
  columns: TColumns,
) =>
  v.object({
    sortKey: v.nullable(v.picklist(columns)),
    sortOrder: v.picklist(["ascending", "descending", "none"]),
  });
