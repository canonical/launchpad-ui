import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "#lib/utils/launchpad/launchpadName.ts";
import { MAX_TABLE_VIEW_NAME_LENGTH } from "./constants";

export const TableViewNameSchema = v.pipe(
  v.optional(v.string(), ""),
  v.trim(),
  v.nonEmpty("Enter a view name"),
  v.maxLength(
    MAX_TABLE_VIEW_NAME_LENGTH,
    `Use at most ${MAX_TABLE_VIEW_NAME_LENGTH} characters`,
  ),
);

export const TableViewSlugSchema = v.pipe(v.string(), v.nonEmpty());

export const TableViewIdSchema = v.pipe(v.string(), v.nonEmpty());

/** Table views are stored per distro, as each distro has its own series. */
export const TableViewDistroSchema = v.pipe(
  v.string(),
  v.regex(LAUNCHPAD_NAME_PATTERN),
);
