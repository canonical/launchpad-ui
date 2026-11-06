import * as v from "valibot";
import { LAUNCHPAD_NAME_PATTERN } from "#lib/utils/launchpad/launchpadName.ts";

/** Validates the syntax of a nonempty Launchpad name. */
export const launchpadNameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.regex(LAUNCHPAD_NAME_PATTERN),
);
