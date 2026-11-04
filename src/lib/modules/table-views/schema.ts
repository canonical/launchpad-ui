import * as v from "valibot";
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
