/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { HTMLInputAttributes } from "svelte/elements";
import type { ModifiedBy } from "$lib/modifiers/types.js";
import type { WithoutChildren } from "$lib/type-utils.js";
import type { TextInputModifiers } from "./modifiers.js";

export interface TextInputProps
  extends WithoutChildren<HTMLInputAttributes>,
    ModifiedBy<TextInputModifiers> {
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
}
