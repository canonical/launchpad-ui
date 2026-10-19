import { enumCodec } from "@canonical/superhref";
import type { Codec } from "@canonical/superhref";

export function choiceCodec<const T extends readonly string[]>(
  values: T,
  defaultValue: T[number],
): Codec<T[number]> {
  return {
    ...enumCodec(values, { default: defaultValue }),
    serialize: (value) => (value === defaultValue ? null : value),
  };
}
