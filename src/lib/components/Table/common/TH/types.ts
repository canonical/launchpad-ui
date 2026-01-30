/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Snippet } from "svelte";
import type { HTMLThAttributes } from "svelte/elements";

type BaseProps = Omit<HTMLThAttributes, "aria-sort">;

export interface THProps extends BaseProps {
  /**
   * The sort direction of the column.
   */
  "aria-sort"?: SortDirection;
  /**
   * A button or a link that toggles the sort direction of the column.
   *
   * Usually <Table.TH.SortButton> or <Table.TH.SortLink>.
   */
  sortSwitcher?: Snippet<[]>;
}

export type SortDirection = Extract<
  HTMLThAttributes["aria-sort"],
  "ascending" | "descending" | undefined
>;

export type THContext = {
  ariaSort: SortDirection;
};
