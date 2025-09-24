/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers";
import type { ButtonModifiers } from "./modifiers";

type BaseProps = SvelteHTMLElements["button"];

export interface ButtonProps extends ModifiedBy<ButtonModifiers>, BaseProps {
  /**
   * The ref of the button.
   *
   * **@bindable**
   */
  ref?: HTMLButtonElement;
  iconLeft?: Snippet;
  iconRight?: Snippet;
  loading?: boolean;
}
