import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";

export const userAvatarModifiers = modifiers(SEMANTIC_MODIFIERS.SIZE);
export type UserAvatarModifiers = typeof userAvatarModifiers;
