import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
import {
  MAX_PACKAGES_SEARCH_LENGTH,
  POCKETS,
  SEARCH_MATCHES,
} from "./constants.js";

/** Validates the syntax of a nonempty Launchpad name. */
const launchpadNameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

/** Validators for populated filter values, without defaults or nullable wrappers. */
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
 * Converts missing or empty strings to null, then validates nonempty values.
 * With trimming enabled, whitespace-only strings also become null.
 */
function nullIfEmpty<TSchema extends v.GenericSchema<string>>(
  schema: TSchema,
  trim = false,
) {
  return v.pipe(
    v.optional(v.string(), ""),
    v.transform((value) => (trim ? value.trim() : value) || null),
    v.nullable(schema),
  );
}

/**
 * Parses form-shaped filters, supplying defaults for missing fields and converting empty choices to null.
 * Search is trimmed, so a whitespace-only search also becomes null.
 */
export const PackagesFiltersSchema = v.object({
  search: nullIfEmpty(PackagesFilterFields.search, true),
  match: v.optional(PackagesFilterFields.match, "contains"),
  series: nullIfEmpty(PackagesFilterFields.series),
  pocket: nullIfEmpty(PackagesFilterFields.pocket),
  maintainer: nullIfEmpty(PackagesFilterFields.maintainer),
  signer: nullIfEmpty(PackagesFilterFields.signer),
  ubuntuChange: v.optional(PackagesFilterFields.ubuntuChange, false),
  allStatuses: v.optional(PackagesFilterFields.allStatuses, false),
});

export type PackagesFilters = v.InferOutput<typeof PackagesFiltersSchema>;

/**
 * Validates filters in their parsed shape: all fields are required, and unset choices must be null.
 */
export const ParsedPackagesFiltersSchema = v.object({
  search: v.nullable(PackagesFilterFields.search),
  match: PackagesFilterFields.match,
  series: v.nullable(PackagesFilterFields.series),
  pocket: v.nullable(PackagesFilterFields.pocket),
  maintainer: v.nullable(PackagesFilterFields.maintainer),
  signer: v.nullable(PackagesFilterFields.signer),
  ubuntuChange: PackagesFilterFields.ubuntuChange,
  allStatuses: PackagesFilterFields.allStatuses,
});
