import type { ModifiersMap } from "$lib/modifiers";

export const LOCAL_MODIFIERS = {
  readMode: ["readonly"],
} as const satisfies ModifiersMap;
