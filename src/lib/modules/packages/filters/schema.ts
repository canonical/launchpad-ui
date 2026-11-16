import * as v from "valibot";
import { launchpadNameSchema } from "#lib/schemas/index.js";
import {
  MAX_PACKAGES_SEARCH_LENGTH,
  POCKETS,
  SEARCH_MATCHES,
} from "./constants.js";

/** Validators for populated filter values, without defaults or optional wrappers. */
export const PackagesFilterFields = {
  search: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.maxLength(MAX_PACKAGES_SEARCH_LENGTH),
  ),
  match: v.picklist(SEARCH_MATCHES),
  series: launchpadNameSchema,
  pocket: v.picklist(POCKETS),
  maintainer: launchpadNameSchema,
  signer: launchpadNameSchema,
  ubuntuChange: v.boolean(),
  allStatuses: v.boolean(),
};

/**
 * Converts missing or empty strings to undefined, then validates nonempty values.
 * With trimming enabled, whitespace-only strings also become undefined.
 */
function undefinedIfEmpty<TSchema extends v.GenericSchema<string>>(
  schema: TSchema,
  trim = false,
) {
  return v.pipe(
    v.optional(v.string(), ""),
    v.transform((value) => (trim ? value.trim() : value) || undefined),
    v.undefinedable(schema),
  );
}

/**
 * Parses form-shaped filters, supplying defaults for missing fields and converting empty choices to undefined.
 * Search is trimmed, so a whitespace-only search also becomes undefined.
 */
export const PackagesFiltersSchema = v.object({
  search: undefinedIfEmpty(PackagesFilterFields.search, true),
  match: v.optional(PackagesFilterFields.match, "contains"),
  series: undefinedIfEmpty(PackagesFilterFields.series),
  pocket: undefinedIfEmpty(PackagesFilterFields.pocket),
  maintainer: undefinedIfEmpty(PackagesFilterFields.maintainer),
  signer: undefinedIfEmpty(PackagesFilterFields.signer),
  ubuntuChange: v.optional(PackagesFilterFields.ubuntuChange, false),
  allStatuses: v.optional(PackagesFilterFields.allStatuses, false),
});

export type PackagesFilters = v.InferOutput<typeof PackagesFiltersSchema>;

/**
 * Validates filters in their parsed shape: all fields are required, and unset choices must be undefined.
 */
export const ParsedPackagesFiltersSchema = v.object({
  search: v.undefinedable(PackagesFilterFields.search),
  match: PackagesFilterFields.match,
  series: v.undefinedable(PackagesFilterFields.series),
  pocket: v.undefinedable(PackagesFilterFields.pocket),
  maintainer: v.undefinedable(PackagesFilterFields.maintainer),
  signer: v.undefinedable(PackagesFilterFields.signer),
  ubuntuChange: PackagesFilterFields.ubuntuChange,
  allStatuses: PackagesFilterFields.allStatuses,
});
