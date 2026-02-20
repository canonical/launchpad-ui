/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["span"]>;

export interface ItemsCountProps extends BaseProps {
  showing: number;
  total?: number;
}
