<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { EditIcon } from "@canonical/svelte-icons";
  import { getImagesContext } from "../context.js";
  import type { TableView } from "../table-views/constants.js";
  import { IMAGES_FILTER_LABELS } from "./constants.js";
  import type { ImagesFilters } from "./schema.js";

  const { tableView }: { tableView: TableView } = $props();

  const context = getImagesContext();
  const queryParams = $derived(context.queryParams);

  const filters = $derived(tableView.filters);

  const filterEntries = $derived<
    Record<
      Exclude<keyof ImagesFilters, "match" | "search">,
      { label?: string; value: string | null }
    >
  >({
    product: {
      label: IMAGES_FILTER_LABELS.product,
      value: filters.product,
    },
    buildStatus: {
      label: IMAGES_FILTER_LABELS.buildStatus,
      value: filters.buildStatus,
    },
    testStatus: {
      label: IMAGES_FILTER_LABELS.testStatus,
      value: filters.testStatus,
    },
  });

  const activeFilters = $derived(
    Object.entries(filterEntries).filter(([, entry]) => entry.value),
  );
</script>

<div class="filters-summary">
  {#if activeFilters.length}
    <ul aria-label="Saved view filters" role="list">
      {#each activeFilters as [key, entry] (key)}
        <li class="filter">
          {#if entry.label}<span>{entry.label}:</span>{/if}
          {entry.value}
        </li>
      {/each}
    </ul>
  {/if}
  {#if tableView.editable}
    <div class="actions">
      <Button
        href={queryParams.editView(tableView.id)}
        aria-label={`Edit ${tableView.name} view`}
        importance="tertiary"
      >
        {#snippet iconLeft()}
          <EditIcon />
        {/snippet}
      </Button>
    </div>
  {/if}
</div>

<style>
  .filters-summary {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    column-gap: var(--dimension-050);

    --filters-summary-separator: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);
    --filters-summary-spacing-block: var(--dimension-100);

    border-block-end: var(--filters-summary-separator);
  }

  ul {
    padding-block: var(--filters-summary-spacing-block);
    padding-inline-start: var(--dimension-100);
    display: flex;
    flex-wrap: wrap;
    list-style: none;
  }

  .filter:not(:last-child) {
    &::after {
      content: ", ";
      white-space: pre;
    }
  }

  span {
    color: var(--color-text-muted);
  }

  .actions {
    display: flex;
    justify-content: end;
    align-items: start;

    :global(> .ds.button) {
      min-block-size: calc(1lh + 2 * var(--filters-summary-spacing-block));
    }
  }

  ul + .actions {
    border-block-start: var(--filters-summary-separator);
  }

  @media (min-width: 621px) {
    .filters-summary {
      flex-direction: row;
    }

    .actions {
      margin-inline-start: auto;
    }

    ul + .actions {
      border: none;

      &::before {
        content: "";
        align-self: stretch;
        border-inline-start: var(--filters-summary-separator);
        margin-block: var(--filters-summary-spacing-block);
        margin-inline-end: var(--dimension-150);
      }
    }
  }
</style>
