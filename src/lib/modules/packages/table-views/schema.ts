import * as v from "valibot";
import { PackagesFiltersSchema } from "../filters/schema.js";

export const MAX_TABLE_VIEW_NAME_LENGTH = 100;

export const TableViewSlugSchema = v.pipe(v.string(), v.nonEmpty());

const TableViewNameSchema = v.pipe(
  v.optional(v.string(), ""),
  v.trim(),
  v.nonEmpty("Enter a view name"),
  v.maxLength(
    MAX_TABLE_VIEW_NAME_LENGTH,
    `Use at most ${MAX_TABLE_VIEW_NAME_LENGTH} characters`,
  ),
);

export const TableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: v.optional(PackagesFiltersSchema, {}),
});

export type TableViewSettings = v.InferOutput<typeof TableViewSettingsSchema>;

export const TableViewEditFormSchema = v.object({
  /** The view's slug, injected by `editTableView.for(slug)` rather than submitted. */
  id: TableViewSlugSchema,
  ...TableViewSettingsSchema.entries,
});
