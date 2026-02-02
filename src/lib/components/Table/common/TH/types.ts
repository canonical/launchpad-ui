/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { HTMLThAttributes } from "svelte/elements";

type BaseProps = HTMLThAttributes;

export interface THProps extends BaseProps {
  /**
   * The sort direction of the column.
   */
  sortDirection?: SortDirection;
  /**
   * A button or link to be included in the header cell.
   *
   * Usually <Table.TH.SortButton> or <Table.TH.SortLink>.
   */
  action?: Snippet<[]>;
}

export type SortDirection = Extract<
  HTMLThAttributes["aria-sort"],
  "ascending" | "descending" | undefined
>;

export type THContext = {
  sortDirection: SortDirection;
};
