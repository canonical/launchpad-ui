<script lang="ts" generics="TFilters extends object">
  import { getFilterTextParts } from "#lib/filter/index.js";
  import { Group } from "./common/index.js";
  import type { FilterSummaryProps } from "./types.js";

  let {
    config,
    filters,
    children,
    actions,
    listLabel,
    class: className,
    ...rest
  }: FilterSummaryProps<TFilters> = $props();

  const parts = $derived(getFilterTextParts(config, filters));
</script>

{#if parts.length || actions}
  <div class={["filter-summary", className]} {...rest}>
    {#if parts.length}
      <ul role="list" aria-label={listLabel}>
        {#if children}
          {@render children(parts)}
        {:else}
          <Group {parts} />
        {/if}
      </ul>
    {/if}
    {#if actions}
      <div class="actions">{@render actions()}</div>
    {/if}
  </div>
{/if}

<style>
  .filter-summary {
    --filter-summary-separator: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);
    --filters-summary-spacing-block: var(--dimension-100);

    display: flex;
    flex-direction: column;
    align-items: stretch;
    column-gap: var(--dimension-050);
    border-block-end: var(--filter-summary-separator);
  }

  ul {
    padding-block: var(--filters-summary-spacing-block);
    padding-inline-start: var(--dimension-100);
    display: flex;
    flex-wrap: wrap;
    list-style: none;
  }

  .actions {
    display: flex;
    justify-content: end;
    align-items: start;

    :global(> .ds.button) {
      min-block-size: calc(1lh + 2 * var(--filters-summary-spacing-block));
    }
  }

  .actions:empty,
  .filter-summary:has(> .actions:only-child:empty) {
    display: none;
  }

  ul + .actions {
    border-block-start: var(--filter-summary-separator);
  }

  @media (min-width: 621px) {
    .filter-summary {
      flex-direction: row;
    }

    .actions {
      margin-inline-start: auto;
    }

    ul + .actions {
      border-block-start: none;

      &::before {
        content: "";
        align-self: stretch;
        border-inline-start: var(--filter-summary-separator);
        margin-block: var(--filters-summary-spacing-block);
        margin-inline-end: var(--dimension-150);
      }
    }
  }
</style>
