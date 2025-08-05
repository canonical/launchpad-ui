import type { Modifiers } from "./types.js";

export const GLOBAL_MODIFIERS = {
  DENSITY: ["dense"],
  SEVERITY: ["negative", "information", "caution", "positive"],
} as const satisfies Modifiers;
