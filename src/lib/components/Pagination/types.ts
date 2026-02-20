/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["nav"];

export interface PaginationProps extends BaseProps {
  /**
   * The id of the table that this pagination component controls. This will be forwarded to the `aria-controls` attribute of the interactive elements within the subcomponents.
   */
  tableId?: string;
  leftGroup?: Snippet<[]>;
  rightGroup?: Snippet<[]>;
  children: Snippet<[]>;
}

export type PaginationContext = {
  tableId?: string;
};
