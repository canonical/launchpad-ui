import {
  SEMANTIC_MODIFIERS,
  combineModifiers,
  modifiers,
} from "$lib/modifiers";
import { LOCAL_MODIFIERS } from "./constants.js";

export const buttonModifiers = modifiers(
  combineModifiers(LOCAL_MODIFIERS, SEMANTIC_MODIFIERS),
  "severity",
  "density",
);

export type ButtonModifiers = typeof buttonModifiers;
