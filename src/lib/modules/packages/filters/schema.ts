import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "$lib/utils/launchpad/launchpadName.js";
import { POCKETS, SEARCH_MATCHES } from "../superhref.js";
import { MAX_PACKAGES_SEARCH_LENGTH } from "./constants.js";

const launchpadNameSchema = v.pipe(v.string(), v.regex(LAUNCHPAD_NAME_PATTERN));

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
    v.nullable(v.pipe(v.string(), v.maxLength(MAX_PACKAGES_SEARCH_LENGTH))),
  ),
  match: v.optional(v.picklist(SEARCH_MATCHES), "contains"),
  series: nullIfEmpty(launchpadNameSchema),
  pocket: nullIfEmpty(v.picklist(POCKETS)),
  maintainer: nullIfEmpty(launchpadNameSchema),
  signer: nullIfEmpty(launchpadNameSchema),
  ubuntuChange: v.optional(v.boolean(), false),
  allStatuses: v.optional(v.boolean(), false),
});

export type PackagesFilters = v.InferOutput<typeof PackagesFiltersSchema>;
