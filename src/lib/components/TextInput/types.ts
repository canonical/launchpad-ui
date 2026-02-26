/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { ModifierFamily } from "$lib/modifier-families/types.js";
import type { TextInputPrimitiveProps } from "../common/index.js";

export interface TextInputProps
  extends TextInputPrimitiveProps, ModifierFamily<"severity"> {
  density?: "dense" | "medium";
}
