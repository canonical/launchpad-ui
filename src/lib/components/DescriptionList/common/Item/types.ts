/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface ItemProps extends BaseProps {
  orientation?: "horizontal" | "vertical";
  term: string;
  children: Snippet<[]>;
}
