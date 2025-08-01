import type { Modifiers } from "$lib/modifiers";

export const LOCAL_MODIFIERS = {
  READ_MODE: ["readonly"],
} as const satisfies Modifiers;
