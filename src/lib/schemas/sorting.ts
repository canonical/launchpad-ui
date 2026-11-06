import * as v from "valibot";
import { SORT_DIRECTIONS } from "../codecs";

export const createSortingSchema = <const TColumns extends v.PicklistOptions>(
  columns: TColumns,
) =>
  v.object({
    sortKey: v.nullable(v.picklist(columns)),
    sortOrder: v.picklist(SORT_DIRECTIONS),
  });
