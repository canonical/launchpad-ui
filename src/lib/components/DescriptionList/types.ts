/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { SvelteHTMLElements } from "svelte/elements";

export type BaseProps = SvelteHTMLElements["dl"];
export interface DescriptionListProps extends BaseProps {
  /**
   * The orientation of the list's items.
   * @default "horizontal"
   */
  orientation?: Orientation;
}

export interface DescriptionListContext {
  orientation: Orientation;
}

type Orientation = "horizontal" | "vertical";
