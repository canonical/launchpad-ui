export * from "./constants.js";

import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";
import { LOCAL_MODIFIERS } from "./constants.js";

export const chipModifiers = modifiers(
  LOCAL_MODIFIERS.READ_MODE,
  SEMANTIC_MODIFIERS.DENSITY,
  SEMANTIC_MODIFIERS.SEVERITY,
);

export type ChipModifiers = typeof chipModifiers;
