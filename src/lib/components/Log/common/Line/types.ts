/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["tr"];

export interface LineProps extends BaseProps {
  /**
   * The line number of the log entry.
   */
  line: number;
  /**
   * The timestamp of the log entry.
   */
  timestamp: Date | string | number;
  /**
   * The severity level of the log entry.
   *
   * @default "info"
   */
  level?: "info" | "warning" | "error" | "debug";
  /**
   * The message content of the log entry.
   */
  children: Snippet<[]>;
}
