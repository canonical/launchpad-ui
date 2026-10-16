<script lang="ts" module>
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import { QueryParamsForm } from "$lib/components/index.js";
  import type { FilterChangeHandler } from "$lib/modules/filtering/types.js";
  import { subId } from "$lib/utils/index.js";
  import { getImagesContext } from "../context.js";
  import {  QueryParams } from "../superhref.js";
import type {ImageOwnedQueryKey} from "../superhref.js";
  import BuildStatusFilterMenu from "./BuildStatusFilterMenu.svelte";
  import ProductFilterMenu from "./ProductFilterMenu.svelte";
  import TestStatusFilterMenu from "./TestStatusFilterMenu.svelte";
  import { page } from "$app/state";

  const IMAGE_FILTERS = {
    product: { key: "product", label: "Product" },
    buildStatus: { key: "build-status", label: "Build status" },
    testStatus: { key: "test-status", label: "Test status" },
  } as const satisfies Record<
    string,
    { key: ImageOwnedQueryKey; label: string }
  >;

  const filterKeys = Object.values(IMAGE_FILTERS).map(({ key }) => key);
</script>

<script lang="ts">
  const id = $props.id();
  const productLabelId = subId(id, "product-label");
  const buildStatusLabelId = subId(id, "build-status-label");
  const testStatusLabelId = subId(id, "test-status-label");

  const context = getImagesContext();
  const queryParams = $derived(context.queryParams);

  const hasActiveFilters = $derived(
    filterKeys.some((name) => Boolean(queryParams[name])),
  );

  const submitFilters: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();
</script>

<QueryParamsForm
  schema={QueryParams}
  url={page.url}
  replaceParams={[...filterKeys, "page"]}
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
>
  <div class="filters-bar dense">
    <div class="filters">
      <div class="filter">
        <span id={productLabelId}>{IMAGE_FILTERS.product.label}:</span>
        <ProductFilterMenu
          name={IMAGE_FILTERS.product.key}
          value={queryParams[IMAGE_FILTERS.product.key]}
          onchange={submitFilters}
          aria-labelledby={productLabelId}
        />
      </div>
      <div class="filter">
        <span id={buildStatusLabelId}>{IMAGE_FILTERS.buildStatus.label}:</span>
        <BuildStatusFilterMenu
          name={IMAGE_FILTERS.buildStatus.key}
          value={queryParams[IMAGE_FILTERS.buildStatus.key]}
          onchange={submitFilters}
          aria-labelledby={buildStatusLabelId}
        />
      </div>
      <div class="filter">
        <span id={testStatusLabelId}>{IMAGE_FILTERS.testStatus.label}:</span>
        <TestStatusFilterMenu
          name={IMAGE_FILTERS.testStatus.key}
          value={queryParams[IMAGE_FILTERS.testStatus.key]}
          onchange={submitFilters}
          aria-labelledby={testStatusLabelId}
        />
      </div>
      <div class="filter-controls">
        <noscript>
          <Button
            type="submit"
            importance="tertiary"
            class="filter-control-button"
          >
            Apply Filters
          </Button>
        </noscript>
        {#if hasActiveFilters}
          <Button
            href={queryParams.patch({
              ...Object.fromEntries(filterKeys.map((name) => [name, null])),
              page: null,
            })}
            aria-label="Clear all filters"
            importance="tertiary"
            class="filter-control-button"
          >
            {#snippet iconLeft()}
              <CloseIcon />
            {/snippet}
            Clear all
          </Button>
        {/if}
      </div>
    </div>
  </div>
</QueryParamsForm>

<style>
  .filters-bar {
    padding-block: var(--dimension-025);
    display: flex;
    flex-direction: column;
    gap: var(--dimension-050);

    :global {
      .options-panel {
        margin-block-start: var(--dimension-050);
      }
    }
  }

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--dimension-150);
    padding-block: var(--dimension-025);
    padding-inline-start: var(--dimension-100);

    .filter {
      display: flex;
      align-items: baseline;
      gap: var(--dimension-050);

      > span {
        color: var(--color-text-muted);
        white-space: nowrap;
        flex: 1;
      }
    }

    .filter-controls {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: end;
      column-gap: var(--dimension-150);
    }

    :global(.filter-control-button) {
      font: var(--ds-typography-text-secondary);
    }
  }

  @media (min-width: 621px) {
    .filters-bar {
      flex-direction: row;
      align-items: start;
    }

    .filters {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      row-gap: var(--dimension-050);

      .filter-controls {
        display: contents;
      }
    }
  }
</style>
