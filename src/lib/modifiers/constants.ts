import type { Modifiers } from "./types.js";

export const SEMANTIC_MODIFIERS = {
  DENSITY: ["dense", "compact"],
  SEVERITY: ["negative", "information", "caution", "positive"],
  SIZE: ["x-small", "small", "medium", "large"],
} as const satisfies Modifiers;
