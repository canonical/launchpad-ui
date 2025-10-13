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

  /**
   * The maximum number of rows the textarea can have.
   * The textarea will grow dynamically between `rows` and `maxRows`.
   *
   * This can be disabled by setting it to `undefined`, the textarea will have a static rows count.
   *
   * @default 4 // double the default rows count (2)
   */
  maxRows?: number | undefined;
};
