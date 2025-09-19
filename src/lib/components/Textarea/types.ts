/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { HTMLTextareaAttributes } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils";

export interface TextareaProps extends WithoutChildren<HTMLTextareaAttributes> {
  /**
   * The value of the textarea.
   *
   * **@bindable**
   */
  value?: string;
}
