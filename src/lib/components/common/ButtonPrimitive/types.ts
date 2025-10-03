/* @canonical/generator-ds 0.10.0-experimental.3 */

import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from "svelte/elements";

export interface ButtonAttributes extends HTMLButtonAttributes {
  as: "button";
}

export interface AnchorAttributes extends HTMLAnchorAttributes {
  as: "a";
  disabled?: HTMLButtonAttributes["disabled"];
}

export type ButtonPrimitiveProps<T extends "button" | "a"> = T extends "button"
  ? ButtonAttributes
  : AnchorAttributes;
