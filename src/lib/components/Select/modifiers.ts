import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
import { modifiers } from "$lib/modifiers/utils.js";

export const selectInputModifiers = modifiers(
  SEMANTIC_MODIFIERS,
  "density",
  "severity",
);

export type SelectInputModifiers = typeof selectInputModifiers;
