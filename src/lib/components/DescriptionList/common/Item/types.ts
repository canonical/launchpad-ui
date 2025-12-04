/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export interface ItemProps extends BaseProps {
  /**
   * Orientation of the item
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Term/name of the item
   */
  name: string;
  /**
   * Description/content of the item
   */
  children: Snippet<[]>;
}
