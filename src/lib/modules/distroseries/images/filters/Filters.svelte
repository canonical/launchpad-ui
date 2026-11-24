<script lang="ts" module>
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import { IMAGE_FILTERS } from "../constants.js";
  import { getImagesContext } from "../context.js";
  import { QueryParams } from "../superhref.js";
  import BuildStatusFilterMenu from "./BuildStatusFilterMenu.svelte";
  import ProductFilterMenu from "./ProductFilterMenu.svelte";
  import TestStatusFilterMenu from "./TestStatusFilterMenu.svelte";
  import { IMAGES_FILTER_REPRESENTATION } from "./constants.js";
  import { page } from "$app/state";

  const filterKeys = Object.values(IMAGE_FILTERS).map(({ key }) => key);
</script>

<script lang="ts">
  import { BookmarkIcon } from "#lib/components/icons/index.js";
  import { QueryParamsForm } from "#lib/launchpad-components/index.js";
  import type { FilterChangeHandler } from "#lib/modules/filtering/types.js";
  import { subId } from "#lib/utils/index.js";
  const id = $props.id();
  const productLabelId = subId(id, "product-label");
  const buildStatusLabelId = subId(id, "build-status-label");
  const testStatusLabelId = subId(id, "test-status-label");

  const context = getImagesContext();
  const queryParams = $derived(context.queryParams);

  const hasActiveFilters = $derived(
    Object.values(IMAGE_FILTERS).some(({ codecKey }) =>
      Boolean(queryParams.images[codecKey]),
    ),
  );

  const submitFilters: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();
</script>

<!-- TODO: Use the common Filters component once
https://warthogs.atlassian.net/browse/LP-5118 lands -->

<div class="filters-bar">
  <QueryParamsForm
    schema={QueryParams}
    url={page.url}
    replaceParams={[...filterKeys, "images.page"]}
    data-sveltekit-keepfocus
    data-sveltekit-noscroll
    class="dense"
  >
    <div class="filters">
      <div class="filter">
        <span id={productLabelId}
          >{IMAGES_FILTER_REPRESENTATION.product.label}:</span
        >
        <ProductFilterMenu
          name={IMAGE_FILTERS.product.key}
          value={queryParams.images[IMAGE_FILTERS.product.codecKey]}
          onchange={submitFilters}
          aria-labelledby={productLabelId}
        />
      </div>
      <div class="filter">
        <span id={buildStatusLabelId}
          >{IMAGES_FILTER_REPRESENTATION.buildStatus.label}:</span
        >
        <BuildStatusFilterMenu
          name={IMAGE_FILTERS.buildStatus.key}
          value={queryParams.images[IMAGE_FILTERS.buildStatus.codecKey]}
          onchange={submitFilters}
          aria-labelledby={buildStatusLabelId}
        />
      </div>
      <div class="filter">
        <span id={testStatusLabelId}
          >{IMAGES_FILTER_REPRESENTATION.testStatus.label}:</span
        >
        <TestStatusFilterMenu
          name={IMAGE_FILTERS.testStatus.key}
          value={queryParams.images[IMAGE_FILTERS.testStatus.codecKey]}
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
            href={queryParams.images.patch({
              ...Object.fromEntries(
                Object.values(IMAGE_FILTERS).map(({ codecKey }) => [
                  codecKey,
                  null,
                ]),
              ),
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
  </QueryParamsForm>
  {#if hasActiveFilters}
    <div class="actions">
      <Button
        importance="tertiary"
        aria-label="Save current filters"
        href={queryParams.addView("bookmark")}
      >
        {#snippet iconLeft()}
          <BookmarkIcon />
        {/snippet}
      </Button>
    </div>
  {/if}
</div>

<style>
  .filters-bar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    column-gap: var(--dimension-050);

    --filters-separator: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    border-block-end: var(--filters-separator);

    :global {
      .options-panel {
        margin-block-start: var(--dimension-050);
      }

      > form {
        display: contents;
      }
    }
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    column-gap: var(--dimension-150);
    padding-block: var(--dimension-050);
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
      column-gap: var(--dimension-150);
    }

    :global(.filter-control-button) {
      font: var(--ds-typography-text-secondary);
    }
  }

  .actions {
    flex-shrink: 0;
    display: flex;
    justify-content: end;
    align-items: start;
    border-block-start: var(--filters-separator);

    :global(> .ds.button) {
      min-block-size: calc(1lh + var(--dimension-200));
    }
  }

  @media (min-width: 621px) {
    .filters-bar {
      flex-direction: row;
    }

    .filters {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      row-gap: var(--dimension-050);
      padding-block: calc(var(--dimension-050) + var(--dimension-025));

      .filter-controls {
        display: contents;
      }
    }

    .actions {
      border-block-start: none;
      margin-inline-start: auto;

      &::before {
        content: "";
        align-self: stretch;
        border-inline-start: var(--filters-separator);
        margin-block: var(--dimension-100);
        margin-inline-end: var(--dimension-150);
      }
    }
  }
</style>
