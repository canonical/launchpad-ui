import type { Codec } from "@canonical/superhref";

/**
 * Trims surrounding whitespace on both parse and
 * serialize. Empty or whitespace-only values become null, omitting the query
 * parameter when serialized.
 */
export function textCodec(): Codec<string | null> {
  return {
    parse: (raw) => raw?.trim() || null,
    serialize: (value) => value?.trim() || null,
  };
}
