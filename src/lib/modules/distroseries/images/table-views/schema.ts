import * as v from "valibot";
import {
  TableViewDistroSchema,
  TableViewIdSchema,
  TableViewNameSchema,
} from "#lib/modules/table-views/schema.ts";
import {
  ImagesFiltersSchema,
  ParsedImagesFiltersSchema,
} from "../filters/schema";

/** Parses whole table view form */
export const TableViewEditFormSchema = v.object({
  name: TableViewNameSchema,
  distro: TableViewDistroSchema,
  // Absent when creating a new view
  id: v.optional(TableViewIdSchema),
  filters: v.optional(ImagesFiltersSchema, {}),
});

/** Parses form-shaped table view settings */
export const TableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: v.optional(ImagesFiltersSchema, {}),
});

export type TableViewSettings = v.InferOutput<typeof TableViewSettingsSchema>;

/** Parses API-shaped table view settings */
export const ParsedTableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: ParsedImagesFiltersSchema,
});
