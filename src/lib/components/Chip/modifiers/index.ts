export * from "./constants.js";

import {
  SEMANTIC_MODIFIERS,
  combineModifiers,
  modifiers,
} from "$lib/modifiers";
import { LOCAL_MODIFIERS } from "./constants.js";

export const chipModifiers = combineModifiers(
  LOCAL_MODIFIERS,
  modifiers(SEMANTIC_MODIFIERS, "density", "severity"),
);

export type ChipModifiers = typeof chipModifiers;
