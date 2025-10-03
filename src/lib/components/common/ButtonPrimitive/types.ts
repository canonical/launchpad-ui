/* @canonical/generator-ds 0.10.0-experimental.3 */

import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from "svelte/elements";

export type ButtonPrimitiveButtonAttributes = HTMLButtonAttributes;

export interface ButtonPrimitiveButtonProps
  extends ButtonPrimitiveButtonAttributes {
  as: "button";
  /**
   * The ref of the button.
   *
   * **@bindable**
   */
  ref?: HTMLButtonElement;
}

export interface ButtonPrimitiveAnchorAttributes extends HTMLAnchorAttributes {
  disabled?: HTMLButtonAttributes["disabled"];
}

export interface ButtonPrimitiveAnchorProps
  extends ButtonPrimitiveAnchorAttributes {
  as: "a";
  /**
   * The ref of the anchor.
   *
   * **@bindable**
   */
  ref?: HTMLAnchorElement;
}

export type ButtonPrimitiveProps<T extends "button" | "a"> = T extends "button"
  ? ButtonPrimitiveButtonProps
  : ButtonPrimitiveAnchorProps;
