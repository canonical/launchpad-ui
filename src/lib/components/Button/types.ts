/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { ModifierFamilyValues } from "$lib/modifier-families";
import type { ButtonPrimitiveProps } from "../common/index.js";

export type ButtonProps = ButtonPrimitiveProps & {
  iconLeft?: Snippet;
  iconRight?: Snippet;
  loading?: boolean;
  severity?: ModifierFamilyValues["severity"] | "base" | "brand";
  density?: ModifierFamilyValues["density"];
};
