/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { TextareaProps as BaseTextareaProps } from "$lib/components/index.js";

export type TextareaProps = BaseTextareaProps & {
  /**
   * Whether to disable the auto completions.
   *
   * When enabled, it will auto complete the lists and code blocks on new line.
   *
   * @default false
   */
  disableAutoCompletions?: boolean;
};
