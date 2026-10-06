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

export const TableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: v.optional(PackagesFiltersSchema, {}),
});

export type TableViewSettings = v.InferOutput<typeof TableViewSettingsSchema>;

/** Already-parsed settings, e.g. staged on the client */
export const ParsedTableViewSettingsSchema = v.object({
  name: TableViewNameSchema,
  filters: ParsedPackagesFiltersSchema,
});

const TableViewEditFormCommonEntries = {
  id: TableViewSlugSchema,
  filters: v.optional(PackagesFiltersSchema, {}),
  // Have to be optional in every variant, as kit only types field keys common to all of them
  maintainerSearch: v.optional(v.string()),
  signerSearch: v.optional(v.string()),
};

// A search doesn't save, so an unfinished name mustn't block it
const TableViewSearchCommonEntries = {
  ...TableViewEditFormCommonEntries,
  name: v.optional(v.string()),
};

export const TableViewEditFormSchema = v.variant("intent", [
  v.object({
    ...TableViewEditFormCommonEntries,
    intent: v.optional(v.literal("confirm")),
    name: TableViewNameSchema,
  }),
  v.object({
    ...TableViewSearchCommonEntries,
    intent: v.literal("search-maintainer"),
    maintainerSearch: PersonSearchSchema,
  }),
  v.object({
    ...TableViewSearchCommonEntries,
    intent: v.literal("search-signer"),
    signerSearch: PersonSearchSchema,
  }),
]);
