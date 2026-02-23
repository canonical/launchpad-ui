/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["time"]>;

export interface DateTimeProps extends BaseProps {
  /**
   * The moment in time to display.
   * This can be a Date object, a timestamp, or a date string.
   */
  date: Date | string | number;
  /**
   * Custom formatter to use.
   */
  formatter?: { format: (date: Date) => string };
}
