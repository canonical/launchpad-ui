import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
import {
  MAX_PACKAGES_SEARCH_LENGTH,
  POCKETS,
  SEARCH_MATCHES,
} from "./constants.js";

const launchpadNameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

/** The rule for each filter's set value */
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

function nullIfEmpty<TSchema extends v.GenericSchema<string>>(schema: TSchema) {
  return v.pipe(
    v.optional(v.string(), ""),
    v.transform((value) => value || null),
    v.nullable(schema),
  );
}

export const PackagesFiltersSchema = v.object({
  search: v.pipe(
    v.optional(v.string(), ""),
    v.trim(),
    v.transform((value) => value || null),
    v.nullable(PackagesFilterFields.search),
  ),
  match: v.optional(PackagesFilterFields.match, "contains"),
  series: nullIfEmpty(PackagesFilterFields.series),
  pocket: nullIfEmpty(PackagesFilterFields.pocket),
  maintainer: nullIfEmpty(PackagesFilterFields.maintainer),
  signer: nullIfEmpty(PackagesFilterFields.signer),
  ubuntuChange: v.optional(PackagesFilterFields.ubuntuChange, false),
  allStatuses: v.optional(PackagesFilterFields.allStatuses, false),
});

export type PackagesFilters = v.InferOutput<typeof PackagesFiltersSchema>;

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
