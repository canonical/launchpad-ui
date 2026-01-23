const trueValues = new Set(["true", "1", "yes", "on", ""]);

/**
 * Convert a string search parameter value to a boolean.
 *
 * @param value - The value of the search parameter.
 * @returns `true` for `"true"`, `"1"`, `"yes"`, `"on"`, or `""` (case-insensitive, with surrounding whitespace trimmed). Otherwise, `false`.
 */
export function booleanSearchParam(value: string | null): boolean {
  return value !== null && trueValues.has(value.toLowerCase().trim());
}
