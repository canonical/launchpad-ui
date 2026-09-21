import type { Codec } from "@canonical/superhref";
import { booleanSearchParam } from "./booleanSearchParam.js";

export function flagCodec(): Codec<boolean> {
  return {
    parse: (raw) => raw !== null && booleanSearchParam(raw),
    serialize: (value) => (value ? "1" : null),
    default: false,
  };
}
