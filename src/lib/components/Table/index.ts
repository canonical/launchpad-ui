import { default as TableRoot } from "./Table.svelte";
import { TH } from "./common/index.js";

const Table = TableRoot as typeof TableRoot & {
  /**
   * A table header cell component that can display sortable columns.
   *
   * @example
   * ```svelte
   * <Table.TH sortDirection="ascending" scope="col">
   *   Sortable Column
   *   {#snippet action()}
   *     <Table.TH.SortButton onclick={handleSortClick} />
   *   {/snippet}
   * </Table.TH>
   * ```
   */
  TH: typeof TH;
};

Table.TH = TH;

export { Table };

export * from "./types.js";
export type {
  SortDirection as TableSortDirection,
  THProps as TableTHProps,
} from "./common/index.js";
