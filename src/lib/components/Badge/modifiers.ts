import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";

export const badgeModifiers = modifiers(SEMANTIC_MODIFIERS, "severity");

export type BadgeModifiers = typeof badgeModifiers;
