import { modifiers } from "$lib/modifiers";
import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
import { LOCAL_MODIFIERS } from "./constants.js";

export const buttonModifiers = modifiers(
  LOCAL_MODIFIERS.SEVERITY,
  SEMANTIC_MODIFIERS.SEVERITY,
  SEMANTIC_MODIFIERS.DENSITY,
);

export type ButtonModifiers = typeof buttonModifiers;
