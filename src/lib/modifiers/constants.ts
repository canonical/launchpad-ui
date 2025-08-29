import type { ModifiersMap } from "./types.js";

export const SEMANTIC_MODIFIERS = {
  density: ["dense", "compact"],
  size: ["x-small", "small", "medium", "large"],
  severity: ["negative", "information", "caution", "positive"],
  lifecycle: ["completed", "failed", "pending", "suspended"],
  approval: ["approved", "disapproved", "changes-requested", "reviewing"],
} as const satisfies ModifiersMap;
