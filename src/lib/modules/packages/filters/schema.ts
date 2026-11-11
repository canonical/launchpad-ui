import * as v from "valibot";
import { nullIfEmpty } from "#lib/modules/filtering/schema.js";
import { launchpadNameSchema } from "#lib/schemas/index.js";
import {
  MAX_PACKAGES_SEARCH_LENGTH,
  POCKETS,
  SEARCH_MATCHES,
} from "./constants.js";

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
