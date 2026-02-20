/* @canonical/generator-ds 0.10.0-experimental.5 */

import { default as PaginationRoot } from "./Pagination.svelte";
import {
  ItemsCount,
  ItemsPerPageSelect,
  PageNavigation,
  PageSelect,
} from "./common/index.js";

const Pagination = PaginationRoot as typeof PaginationRoot & {
  /**
   * The `PageSelect` component renders a select input for navigating to a specific page.
   *
   * @example
   * ```svelte
   *  <Pagination.PageSelect
   *    bind:value={currentPage}
   *    totalPages={numberOfPages}
   *  >
   *    {#each { length: numberOfPages }, i (i)}
   *      <option value={i + 1}>{i + 1}</option>
   *    {/each}
   *  </Pagination.PageSelect>
   * ```
   */
  PageSelect: typeof PageSelect;
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
