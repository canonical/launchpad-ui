import * as v from "valibot";
import {
  TableViewNameSchema,
  TableViewSlugSchema,
} from "$lib/modules/table-views/schema";
import {
  ImagesFiltersSchema,
  ParsedImagesFiltersSchema,
} from "../filters/schema";

/** Parses form-shaped table view settings */
export const TableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: ImagesFiltersSchema,
});

/** Parses whole table view form */
export const TableViewEditFormSchema = v.object({
  id: TableViewSlugSchema,
  ...TableViewSettingsSchema.entries,
});

export type TableViewSettings = v.InferOutput<typeof TableViewSettingsSchema>;

/** Parses API-shaped table view settings */
export const ParsedTableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: ParsedImagesFiltersSchema,
});
