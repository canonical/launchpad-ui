import { default as TableRoot } from "./Table.svelte";
import { TH } from "./common/index.js";

const Table = TableRoot as typeof TableRoot & {
  TH: typeof TH;
};

Table.TH = TH;

export { Table };

export * from "./types.js";
export type {
  SortDirection as TableSortDirection,
  THProps as TableTHProps,
} from "./common/index.js";
