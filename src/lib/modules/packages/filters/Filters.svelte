<script lang="ts" module>
  import type { PackageOwnedQueryKey } from "../superhref.js";
  import type { PersonFilterKey } from "./inputs.js";
  import type { PackagesFilters } from "./schema.js";

  const filterQueryParams = {
    search: "search",
    match: "match",
    maintainer: "maintainer",
    signer: "signer",
    series: "series",
    pocket: "pocket",
    ubuntuChange: "ubuntu-change",
    allStatuses: "all-statuses",
  } as const satisfies { [K in keyof PackagesFilters]: PackageOwnedQueryKey };

  const personSearchQueryParams = {
    maintainer: "maintainer-search",
    signer: "signer-search",
  } as const satisfies { [K in PersonFilterKey]: PackageOwnedQueryKey };

  const filterParamNames = [
    ...Object.values(filterQueryParams),
    ...Object.values(personSearchQueryParams),
  ];
</script>

<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { BookmarkIcon } from "#lib/components/icons/index.js";
  import { QueryParamsForm } from "#lib/components/index.js";
  import type { FilterChangeHandler } from "#lib/modules/filtering/types.js";
  import { getPackagesContext } from "../context.js";
  import { CLEARED_FILTER_PARAMS, QueryParams } from "../superhref.js";
  import type { PackageFilterInputs } from "./inputs.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const { filters }: { filters: Snippet<[PackageFilterInputs]> } = $props();

  const context = getPackagesContext();
  const queryParams = $derived(context.queryParams);
  const hasActiveFilters = $derived(
    Boolean(
      queryParams.search ||
      queryParams.maintainer ||
      queryParams.signer ||
      queryParams.series ||
      queryParams.pocket ||
      queryParams["ubuntu-change"] ||
      queryParams["all-statuses"],
    ),
  );

  const submitFilters: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();

  const inputs: PackageFilterInputs = {
    value: (key) => {
      const name = filterQueryParams[key];
      return { name, value: queryParams[name] ?? undefined };
    },
    toggle: (key) => {
      const name = filterQueryParams[key];
      return { name, checked: queryParams[name] };
    },
    personSearch: (key) => {
      const name = personSearchQueryParams[key];
      return { searchInputProps: { name, value: queryParams[name] } };
    },
    onchange: submitFilters,
  };

  // With JS the person searches run in the comboboxes and shouldn't stay in the URL
  onMount(() => {
    if (!queryParams["maintainer-search"] && !queryParams["signer-search"]) {
      return;
    }
    goto(
      queryParams.patch({ "maintainer-search": null, "signer-search": null }),
      { replace: true, reset: false },
    );
  });
</script>

<div class="filters-bar">
  <QueryParamsForm
    schema={QueryParams}
    url={page.url}
    replaceParams={[...filterParamNames, "page"]}
    data-sveltekit-reset={false}
    class="dense"
  >
    {@render filters(inputs)}
    <div class="filter-controls">
      <noscript>
        <Button
          type="submit"
          importance="secondary"
          class="filter-control-button"
        >
          Apply filters
        </Button>
      </noscript>
      {#if hasActiveFilters}
        <Button
          href={queryParams.patch({ ...CLEARED_FILTER_PARAMS, page: null })}
          aria-label="Clear all filters"
          importance="secondary"
          class="filter-control-button"
        >
          {#snippet iconLeft()}
            <CloseIcon />
          {/snippet}
          Clear all
        </Button>
      {/if}
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
    border-block-end: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    :global(> form) {
      display: contents;
    }
  }

  .filter-controls {
    display: flex;
    align-items: center;
    column-gap: var(--dimension-150);

    :global(.filter-control-button) {
      font: var(--ds-typography-text-secondary);
    }
  }

  .actions {
    flex-shrink: 0;
    display: flex;
    justify-content: end;
    align-items: start;
    border-block-start: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    :global(> .ds.button) {
      min-block-size: calc(1lh + var(--dimension-200));
    }
  }

  @media (min-width: 621px) {
    .filters-bar {
      flex-direction: row;
    }

    .actions {
      border-block-start: none;
      margin-inline-start: auto;

      &::before {
        content: "";
        align-self: stretch;
        border-inline-start: var(--dimension-stroke-thickness-medium) solid
          var(--color-border-muted);
        margin-block: var(--dimension-100);
        margin-inline-end: var(--dimension-150);
      }
    }
  }
</style>
