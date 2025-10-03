/* @canonical/generator-ds 0.10.0-experimental.3 */

import type {
  HTMLAnchorAttributes,
  HTMLButtonAttributes,
} from "svelte/elements";

type ButtonPrimitiveAnchorAttributes = HTMLAnchorAttributes & {
  as: "a";
  ref?: HTMLAnchorElement;
  disabled?: HTMLButtonAttributes["disabled"];
};

type ButtonPrimitiveButtonAttributes = HTMLButtonAttributes & {
  as: "button";
  ref?: HTMLButtonElement;
};

export type ButtonPrimitiveProps<T extends "button" | "a"> = T extends "button"
  ? ButtonPrimitiveButtonAttributes
  : ButtonPrimitiveAnchorAttributes;
