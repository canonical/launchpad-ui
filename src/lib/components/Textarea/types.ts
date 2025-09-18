/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { HTMLTextareaAttributes } from "svelte/elements";

export interface TextareaProps extends Omit<HTMLTextareaAttributes, "value"> {
  /**
   * The value of the textarea.
   *
   * **@bindable**
   */
  value?: string;
}
