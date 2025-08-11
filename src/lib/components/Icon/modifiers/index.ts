import { modifiers } from "$lib/modifiers";
import { LOCAL_MODIFIERS } from "./constants.js";

export const iconModifiers = modifiers(LOCAL_MODIFIERS.ANIMATION);

export type IconModifiers = typeof iconModifiers;
