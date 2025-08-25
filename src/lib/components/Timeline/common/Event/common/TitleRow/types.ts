/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface TitleRowProps extends BaseProps {
  trailingText?: string;
  children: Snippet<[]>;
  date: Date;
}
