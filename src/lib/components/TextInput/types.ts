/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { ModifierFamily } from "$lib/modifier-families/types.js";
import type { WithoutChildren } from "$lib/type-utils.js";

export interface TextInputProps
  extends WithoutChildren<HTMLInputAttributes>, ModifierFamily<"severity"> {
  /**
   * The type of input control to display.
   */
  type?: "text" | "password" | "email" | "url" | "tel" | "search";
  /**
   * The value of the input.
   *
   * **@bindable**
   */
  value?: string;

  density?: "dense" | "medium";
}
