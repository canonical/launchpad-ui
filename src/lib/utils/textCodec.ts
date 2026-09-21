import type { Codec } from "@canonical/superhref";

export function textCodec(): Codec<string | null> {
  return {
    parse: (raw) => raw?.trim() || null,
    serialize: (value) => value?.trim() || null,
  };
}
