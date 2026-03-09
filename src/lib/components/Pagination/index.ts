/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as PaginationRoot } from "./Pagination.svelte";
import {
  ItemsCount,
  ItemsPerPageSelect,
  PageInput,
  PageNavigation,
} from "./common/index.js";

const Pagination = PaginationRoot as typeof PaginationRoot & {
  /**
   * The `PageInput` component renders an input for navigating to a specific page.
   *
   * @example
   * ```svelte
   *  <Pagination.PageInput
   *    bind:value={currentPage}
   *    totalPages={numberOfPages}
   *  />
   * ```
   */
  PageInput: typeof PageInput;
  /**
   * The `PageNavigation` component is a link/button for navigating to the next, previous, first, or last page.
   *
   * @example
   * ```svelte
   * <Pagination.PageNavigation direction="previous" />
   * <Pagination.PageNavigation direction="next" />
   * ```
   */
  PageNavigation: typeof PageNavigation;
  /**
   * The `ItemsPerPageSelect` component renders a select input for changing the number of items shown per page.
   *
   * @example
   * ```svelte
   * <Pagination.ItemsPerPageSelect bind:value={itemsPerPage}>
   *   <option value={5}>5</option>
   *   <option value={10}>10</option>
   * </Pagination.ItemsPerPageSelect>
   * ```
   */
  ItemsPerPageSelect: typeof ItemsPerPageSelect;
  /**
   * The `ItemsCount` component displays the total number of items and the number of items currently being shown.
   *
   * @example
   * ```svelte
   * <Pagination.ItemsCount
   *   showing={itemsOnCurrentPage}
   *   total={totalItems}
   * />
   * ```
   */
  ItemsCount: typeof ItemsCount;
};

Pagination.PageInput = PageInput;
Pagination.PageNavigation = PageNavigation;
Pagination.ItemsPerPageSelect = ItemsPerPageSelect;
Pagination.ItemsCount = ItemsCount;

export { Pagination };
export * from "./types.js";

export type {
  ItemsCountProps as PaginationItemsCountProps,
  ItemsPerPageSelectProps as PaginationItemsPerPageSelectProps,
  PageInputProps as PaginationPageInputProps,
  PageNavigationProps as PaginationPageNavigationProps,
} from "./common/index.js";
