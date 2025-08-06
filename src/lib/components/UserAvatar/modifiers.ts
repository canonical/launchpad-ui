import { SEMANTIC_MODIFIERS, modifiers } from "$lib/modifiers";

export const UserAvatarModifiers = modifiers(SEMANTIC_MODIFIERS.SIZE);
export type UserAvatarModifiers = typeof UserAvatarModifiers;
