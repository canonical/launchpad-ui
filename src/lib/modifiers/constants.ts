import type { Modifiers } from "./types.js";

export const SEMANTIC_MODIFIERS = {
  DENSITY: ["dense"],
  SEVERITY: ["negative", "information", "caution", "positive"],
  SIZE: ["small", "large"],
} as const satisfies Modifiers;
