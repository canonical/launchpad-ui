import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";

export const iconTextModifiers = modifiers(
  SEMANTIC_MODIFIERS,
  "size",
  "approval",
  "lifecycle",
);

export type IconTextModifiers = typeof iconTextModifiers;
