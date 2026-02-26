/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ModifierFamily } from "$lib/modifier-families/types.js";
import type { NumberInputPrimitiveProps } from "../common/index.js";

export interface NumberInputProps
  extends Omit<NumberInputPrimitiveProps, "type">, ModifierFamily<"severity"> {
  density?: "dense" | "medium";
}
