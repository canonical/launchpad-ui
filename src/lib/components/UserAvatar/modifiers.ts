import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";

export const userAvatarModifiers = modifiers(SEMANTIC_MODIFIERS, "size");
export type UserAvatarModifiers = typeof userAvatarModifiers;
