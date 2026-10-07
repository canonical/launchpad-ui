import * as v from "valibot";
import {
  MAX_PEOPLE_SEARCH_LENGTH,
  MIN_PEOPLE_SEARCH_LENGTH,
} from "./constants.js";

export const PersonSearchSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(
    MIN_PEOPLE_SEARCH_LENGTH,
    `Enter at least ${MIN_PEOPLE_SEARCH_LENGTH} characters`,
  ),
  v.maxLength(
    MAX_PEOPLE_SEARCH_LENGTH,
    `Use at most ${MAX_PEOPLE_SEARCH_LENGTH} characters`,
  ),
);
