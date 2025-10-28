/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["tr"]>;

export interface LineProps extends BaseProps {
  line: number;
  timestamp: Date | string | number;
  level: "info" | "warning" | "error" | "debug";
  message: string;
}
