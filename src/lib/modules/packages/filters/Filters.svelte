<script lang="ts" module>
  import type { PackageOwnedQueryKey } from "../superhref.js";

  const filterInputsNames = {
    search: "search",
    match: "match",
    maintainer: "maintainer",
    signer: "signer",
    series: "series",
    pocket: "pocket",
    "ubuntu-change": "ubuntu-change",
    "all-statuses": "all-statuses",
  } as const satisfies { [K in PackageOwnedQueryKey]?: K };

  type FilterInputName =
    (typeof filterInputsNames)[keyof typeof filterInputsNames];

  const filterNames = Object.values(filterInputsNames) as FilterInputName[];
  const clearableFilterNames = filterNames.filter(
    (name) => name !== filterInputsNames.match,
  );
</script>

<script lang="ts">
  import { Button, SearchBox } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import { QueryParamsForm } from "$lib/components/index.js";
  import { subId } from "$lib/utils/index.js";
  import { getPackagesContext } from "../context.js";
  import { QueryParams } from "../superhref.js";
  import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
  import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
  import PocketFilterMenu from "./PocketFilterMenu.svelte";
  import SearchModeMenu from "./SearchModeMenu.svelte";
  import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
  import { page } from "$app/state";

  const id = $props.id();
  const filtersFormId = subId(id, "filters-form");
  const searchModeLabelId = subId(id, "search-mode-label");
  const maintainerLabelId = subId(id, "maintainer-label");
  const signerLabelId = subId(id, "signer-label");
  const seriesLabelId = subId(id, "series-label");
  const pocketLabelId = subId(id, "pocket-label");
  const moreFiltersLabelId = subId(id, "more-filters-label");

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
</script>

<div class="filters-bar">
  <div class="search">
    <span id={searchModeLabelId} class="visually-hidden">Search mode:</span>
    <SearchModeMenu
      form={filtersFormId}
      inputName={filterInputsNames.match}
      value={queryParams.match}
      aria-labelledby={searchModeLabelId}
    />
    <!-- TODO(DAL): Style the searchbox according to the design -->
    <SearchBox
      form={filtersFormId}
      name={filterInputsNames.search}
      value={queryParams.search ?? ""}
      placeholder="Search"
      aria-label="Search packages"
      class="search-box"
    />
  </div>
  <div class="filters">
    <div class="filter">
      <span id={maintainerLabelId}>Maintained by:</span>
      <PersonFilterCombobox
        form={filtersFormId}
        inputName={filterInputsNames.maintainer}
        selectedPersonName={queryParams.maintainer}
        groupName="maintainers"
        aria-labelledby={maintainerLabelId}
      />
    </div>
    <div class="filter">
      <span id={signerLabelId}>Signed by:</span>
      <PersonFilterCombobox
        form={filtersFormId}
        inputName={filterInputsNames.signer}
        selectedPersonName={queryParams.signer}
        groupName="signers"
        aria-labelledby={signerLabelId}
      />
    </div>
    <div class="filter">
      <span id={seriesLabelId}>Series:</span>
      <SeriesFilterMenu
        form={filtersFormId}
        inputName={filterInputsNames.series}
        value={queryParams.series}
        aria-labelledby={seriesLabelId}
      />
    </div>
    <div class="filter">
      <span id={pocketLabelId}>Pocket:</span>
      <PocketFilterMenu
        form={filtersFormId}
        inputName={filterInputsNames.pocket}
        value={queryParams.pocket}
        aria-labelledby={pocketLabelId}
      />
    </div>
    <div class="filter-controls">
      <div class="filter">
        <span id={moreFiltersLabelId} class="visually-hidden"
          >More filters:</span
        >
        <MoreFiltersMenu
          form={filtersFormId}
          switches={[
            {
              inputName: filterInputsNames["ubuntu-change"],
              text: "Only show packages changed by Ubuntu",
              checked: queryParams["ubuntu-change"],
            },
            {
              inputName: filterInputsNames["all-statuses"],
              text: "Include Superseded and Deleted",
              checked: queryParams["all-statuses"],
            },
          ]}
          aria-labelledby={moreFiltersLabelId}
        />
      </div>
      <noscript>
        <Button
          type="submit"
          form={filtersFormId}
          importance="tertiary"
          density="dense"
          class="filter-control-button"
        >
          Apply Filters
        </Button>
      </noscript>
      {#if hasActiveFilters}
        <Button
          href={queryParams.patch({
            ...Object.fromEntries(
              clearableFilterNames.map((name) => [name, null]),
            ),
            page: null,
          })}
          aria-label="Clear all filters"
          importance="tertiary"
          density="dense"
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

<QueryParamsForm
  id={filtersFormId}
  schema={QueryParams}
  url={page.url}
  replaceParams={[...filterNames, "page"]}
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
/>

<style>
  .filters-bar {
    padding-block: var(--dimension-025);
    display: flex;
    flex-direction: column;
    gap: var(--dimension-050);

    :global {
      .options-panel {
        margin-block-start: var(--dimension-050);
        width: 300px;
        max-height: 350px;
        overflow: auto;
      }
    }
  }

  .search {
    display: flex;
    align-items: center;
    border-bottom: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);
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

    .search {
      border-bottom: none;

      :global {
        .search-box {
          flex-basis: 160px;

          > input {
            min-width: 160px;
          }
        }
      }
    }

    .filters {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      row-gap: var(--dimension-050);

      &::before {
        position: absolute;
        content: "";
        display: block;
        inline-size: var(--dimension-stroke-thickness-medium);
        inset-inline-start: 0;
        inset-block: 4px;
        background-color: var(--color-border-muted);
      }

      .filter-controls {
        display: contents;
      }
    }
  }
</style>
