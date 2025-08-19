import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
import { modifiers } from "$lib/modifiers/index.js";

export const badgeModifiers = modifiers(SEMANTIC_MODIFIERS.SEVERITY);

export type BadgeModifiers = typeof badgeModifiers;
