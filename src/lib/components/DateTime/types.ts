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
   * Whether to display the date as an absolute time (e.g., "9/17/2023, 3:24 PM") instead of a relative time (e.g., "3 hours ago").
   */
  absolute?: boolean;
  /**
   * The threshold in milliseconds below which to display the `nowLabel` label.
   *
   * Has no effect if `absolute` is true.
   *
   * @default 60_000 (1 minute)
   */
  nowThreshold?: number;
  /**
   * The label to display when the time is within the `nowThreshold`.
   *
   * Has no effect if `absolute` is true.
   *
   * @default "now"
   */
  nowLabel?: string;
}

export type RelativeTimeFormatValue = {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
};
