/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["table"];

export interface LogProps extends BaseProps {
  hideTimestamp?: boolean;
  timeZone?: TimeZone;
  caption?: string;
}

export type LogContext = {
  timeZone: TimeZone;
};

export type TimeZone = "UTC" | "local";
