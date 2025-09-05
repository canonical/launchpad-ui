import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
import { modifiers } from "$lib/modifiers/utils.js";

export const textInputModifiers = modifiers(
  SEMANTIC_MODIFIERS,
  "density",
  "severity",
);

export type TextInputModifiers = typeof textInputModifiers;
