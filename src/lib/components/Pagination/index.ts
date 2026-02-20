/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as PaginationRoot } from "./Pagination.svelte";
import {
  ItemsCount,
  ItemsPerPageSelect,
  PageNavigation,
  PageSelect,
} from "./common/index.js";

const Pagination = PaginationRoot as typeof PaginationRoot & {
  PageSelect: typeof PageSelect;
  PageNavigation: typeof PageNavigation;
  ItemsPerPageSelect: typeof ItemsPerPageSelect;
  ItemsCount: typeof ItemsCount;
};

Pagination.PageSelect = PageSelect;
Pagination.PageNavigation = PageNavigation;
Pagination.ItemsPerPageSelect = ItemsPerPageSelect;
Pagination.ItemsCount = ItemsCount;

export { Pagination };
export * from "./types.js";

export type {
  ItemsCountProps as PaginationItemsCountProps,
  ItemsPerPageSelectProps as PaginationItemsPerPageSelectProps,
  PageNavigationProps as PaginationPageNavigationProps,
  PageSelectProps as PaginationPageSelectProps,
} from "./common/index.js";
