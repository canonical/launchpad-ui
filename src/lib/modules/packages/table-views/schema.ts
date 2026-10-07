import * as v from "valibot";
import {
  PackagesFiltersSchema,
  ParsedPackagesFiltersSchema,
} from "../filters/schema.js";
import { PersonSearchSchema } from "../schema.js";
import { MAX_TABLE_VIEW_NAME_LENGTH } from "./constants.js";

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

/** A table view's name and package filters in form-input shape. */
export const TableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: v.optional(PackagesFiltersSchema, {}),
});

export type TableViewSettings = v.InferOutput<typeof TableViewSettingsSchema>;

export const ParsedTableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: ParsedPackagesFiltersSchema,
});

const TableViewEditFormCommonEntries = {
  id: TableViewSlugSchema,
  filters: v.optional(PackagesFiltersSchema, {}),
};

/** A table-view edit submission: confirmation, maintainer search, or signer search. */
export const TableViewEditFormSchema = v.variant("intent", [
  v.object({
    ...TableViewEditFormCommonEntries,
    intent: v.optional(v.literal("confirm")),

    name: TableViewNameSchema,

    // Optionals have to be included in every variant to satisfy the form's type requirements.
    maintainerSearch: v.optional(v.string()),
    signerSearch: v.optional(v.string()),
  }),
  v.object({
    ...TableViewEditFormCommonEntries,
    intent: v.literal("search-maintainer"),

    maintainerSearch: PersonSearchSchema,

    signerSearch: v.optional(v.string()),
    name: v.optional(v.string()),
  }),
  v.object({
    ...TableViewEditFormCommonEntries,
    intent: v.literal("search-signer"),

    signerSearch: PersonSearchSchema,

    name: v.optional(v.string()),
    maintainerSearch: v.optional(v.string()),
  }),
]);
