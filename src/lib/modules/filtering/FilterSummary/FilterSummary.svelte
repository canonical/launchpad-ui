<script module lang="ts">
  import type { FilterTextPart } from "../representation.js";

  function groupParts<TFilters extends object>(
    parts: FilterTextPart<TFilters>[],
    keyGroups?: (keyof TFilters)[][],
  ): FilterTextPart<TFilters>[][] {
    if (!parts.length) return [];
    if (!keyGroups?.length) return [parts];

    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const assigned = new Set<keyof TFilters>();
    const result: FilterTextPart<TFilters>[][] = [];

    for (const keys of keyGroups) {
      const group: FilterTextPart<TFilters>[] = [];
      for (const key of keys) {
        if (assigned.has(key)) continue;
        assigned.add(key);
        const part = parts.find((item) => item.key === key);
        if (part) group.push(part);
      }
      if (group.length) result.push(group);
    }

    const remaining = parts.filter((part) => !assigned.has(part.key));
    if (remaining.length) result.push(remaining);

    return result;
  }
</script>

<script lang="ts" generics="TFilters extends object">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { EditIcon } from "@canonical/svelte-icons";
  import { getFilterTextParts } from "../representation.js";
  import type { FilterSummaryProps } from "./types.js";

  let {
    config,
    filters,
    tableViewName,
    editTableViewHref,
    groups,
    class: className,
    ...rest
  }: FilterSummaryProps<TFilters> = $props();

  const groupedParts = $derived(
    groupParts(getFilterTextParts(config, filters), groups),
  );
</script>

{#if groupedParts.length || editTableViewHref}
  <div class={["filter-summary", className]} {...rest}>
    {#if groupedParts.length}
      <ul role="list" aria-label={`${tableViewName} filters`}>
        {#each groupedParts as group (group[0].key)}
          {#each group as part, index (part.key)}
            <li class:last-part-in-group={index === group.length - 1}>
              {#if part.label}<span>{part.label}:</span>{/if}
              {part.text}
            </li>
          {/each}
        {/each}
      </ul>
    {/if}
    {#if editTableViewHref}
      <div class="actions">
        <Button
          href={editTableViewHref}
          aria-label={`Edit ${tableViewName} view`}
          importance="tertiary"
        >
          {#snippet iconLeft()}
            <EditIcon />
          {/snippet}
        </Button>
      </div>
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

  li {
    &:not(.last-part-in-group)::after {
      content: ", ";
      white-space: pre;
    }

    &.last-part-in-group {
      &:not(:last-child) {
        border-inline-end: var(--filter-summary-separator);
        padding-inline-end: var(--dimension-150);
      }

      + li {
        padding-inline-start: var(--dimension-150);
      }
    }

    span {
      color: var(--color-text-muted);
    }
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
