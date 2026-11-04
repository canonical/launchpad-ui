import * as v from "valibot";

/**
 * Converts missing or empty strings to null, then validates nonempty values.
 * With trimming enabled, whitespace-only strings also become null.
 */
export function nullIfEmpty<TSchema extends v.GenericSchema<string>>(
  schema: TSchema,
  trim = false,
) {
  return v.pipe(
    v.optional(v.string(), ""),
    v.transform((value) => (trim ? value.trim() : value) || null),
    v.nullable(schema),
  );
}
