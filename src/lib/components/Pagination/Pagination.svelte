<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setPaginationContext } from "./context.js";
  import type { PaginationProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination";

  let {
    class: className,
    tableId,
    children,
    leftGroup,
    rightGroup,
    ...rest
  }: PaginationProps = $props();

  setPaginationContext({
    get tableId() {
      return tableId;
    },
  });
</script>

<nav class={[componentCssClassName, className]} {...rest}>
  {#if leftGroup}
    <div class="left-group">
      {@render leftGroup()}
    </div>
  {/if}
  <div class="right-group">
    {#if rightGroup}
      <div class="right-group-content">
        {@render rightGroup()}
      </div>
    {/if}
    <div class="page-navigation">
      {@render children()}
    </div>
  </div>
</nav>

<!-- @component
`Pagination` Provides a set of controls for navigating through paginated data.

## Example Usage
```svelte
<Pagination tableId="example-table">
  {#snippet leftGroup()}
    <Pagination.ItemsPerPageSelect bind:value={itemsPerPage}>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </Pagination.ItemsPerPageSelect>
    <Pagination.ItemsCount
      showing={itemsOnCurrentPage}
      total={totalItems}
    />
  {/snippet}
  {#snippet rightGroup()}
    <Pagination.PageSelect
      bind:value={currentPage}
      totalPages={numberOfPages}
    >
      {#each { length: numberOfPages }, i (i)}
        <option value={i + 1}>{i + 1}</option>
      {/each}
    </Pagination.PageSelect>
  {/snippet}
  <Pagination.PageNavigation
    direction="first"
    disabled={currentPage === 1}
    onclick={() => (currentPage = 1)}
  />
  <Pagination.PageNavigation
    direction="previous"
    disabled={currentPage === 1}
    onclick={() => (currentPage = Math.max(1, currentPage - 1))}
  />
  <Pagination.PageNavigation
    direction="next"
    disabled={currentPage === numberOfPages}
    onclick={() => (currentPage = Math.min(numberOfPages, currentPage + 1))}
  />
  <Pagination.PageNavigation
    direction="last"
    disabled={currentPage === numberOfPages}
    onclick={() => (currentPage = numberOfPages)}
  />
</Pagination>
```
-->
