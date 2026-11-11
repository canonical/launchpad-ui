import * as v from "valibot";

/**
 * Converts missing or empty strings to undefined, then validates nonempty values.
 * With trimming enabled, whitespace-only strings also become undefined.
 */
export function undefinedIfEmpty<TSchema extends v.GenericSchema<string>>(
  schema: TSchema,
  trim = false,
) {
  return v.pipe(
    v.optional(v.string(), ""),
    v.transform((value) => (trim ? value.trim() : value) || undefined),
    v.undefinedable(schema),
  );
}
