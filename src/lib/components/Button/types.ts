/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import type { ModifierFamilyValues } from "$lib/modifier-families";

type BaseProps = SvelteHTMLElements["button"];

export interface ButtonProps extends BaseProps {
  /**
   * The ref of the button.
   *
   * **@bindable**
   */
  ref?: HTMLButtonElement;
  iconLeft?: Snippet;
  iconRight?: Snippet;
  loading?: boolean;
  severity?: ModifierFamilyValues["severity"] | "base" | "brand";
  density?: ModifierFamilyValues["density"];
}
