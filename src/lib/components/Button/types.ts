/* @canonical/generator-ds 0.9.0-experimental.22 */

import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export interface ButtonProps extends HTMLButtonAttributes {
  /** The visual style of the button */
  appearance?: "default" | "brand" | "primary" | "negative" | "base";
  /** The size of the button */
  size?: "default" | "dense" | "small";
  /** The text to display on the button */
  children?: Snippet;
  /** The icon to display on the left side of the button */
  iconLeft?: Snippet;
  /** The icon to display on the right side of the button */
  iconRight?: Snippet;
  /**
   * Whether the button is in the loading state.
   * The loading button will show a spinner and disable interaction.
   **/
  loading?: boolean;
}
