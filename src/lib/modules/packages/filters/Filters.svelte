<script lang="ts" module>
  import type { PackageOwnedQueryKey } from "../superhref.js";

  const filterInputsNames = {
    search: "search",
    match: "match",
    maintainer: "maintainer",
    signer: "signer",
    "maintainer-search": "maintainer-search",
    "signer-search": "signer-search",
    series: "series",
    pocket: "pocket",
    "ubuntu-change": "ubuntu-change",
    "all-statuses": "all-statuses",
  } as const satisfies { [K in PackageOwnedQueryKey]?: K };

  type FilterInputName =
    (typeof filterInputsNames)[keyof typeof filterInputsNames];

  const filterNames = Object.values(filterInputsNames) as FilterInputName[];
</script>

<script lang="ts">
  import { Button, SearchBox } from "@canonical/svelte-ds-app-launchpad";
  import { CloseIcon } from "@canonical/svelte-icons";
  import { onMount } from "svelte";
  import { BookmarkIcon } from "#lib/components/icons/index.js";
  import { QueryParamsForm } from "#lib/components/index.js";
  import { subId } from "#lib/utils/index.js";
  import { getPackagesContext } from "../context.js";
  import { CLEARED_FILTER_PARAMS, QueryParams } from "../superhref.js";
  import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
  import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
  import PocketFilterMenu from "./PocketFilterMenu.svelte";
  import SearchModeMenu from "./SearchModeMenu.svelte";
  import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
  import { PACKAGES_FILTER_LABELS as labels } from "./constants.js";
  import type { FilterChangeHandler, SeriesGroups } from "./types.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const { seriesGroups }: { seriesGroups: SeriesGroups } = $props();

  const id = $props.id();
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

  const submitFilters: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();

  // With JS the person searches run in the comboboxes and shouldn't stay in the URL
  onMount(() => {
    if (!queryParams["maintainer-search"] && !queryParams["signer-search"]) {
      return;
    }
    goto(
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      queryParams.patch({ "maintainer-search": null, "signer-search": null }),
      { replace: true, reset: false },
    );
  });
</script>

<div class="filters-bar">
  <QueryParamsForm
    schema={QueryParams}
    url={page.url}
    replaceParams={[...filterNames, "page"]}
    data-sveltekit-reset={false}
    class="dense"
  >
    <div class="search">
      <span id={searchModeLabelId} class="visually-hidden">{labels.match}:</span
      >
      <SearchModeMenu
        name={filterInputsNames.match}
        value={queryParams.match}
        onchange={submitFilters}
        aria-labelledby={searchModeLabelId}
      />
      <!-- TODO(DAL): Style the searchbox according to the design -->
      <SearchBox
        name={filterInputsNames.search}
        value={queryParams.search ?? ""}
        placeholder="Search"
        aria-label="Search packages"
        class="search-box"
      />
    </div>
    <div class="filters">
      <div class="filter">
        <span id={maintainerLabelId}>{labels.maintainer}:</span>
        <PersonFilterCombobox
          name={filterInputsNames.maintainer}
          searchInputProps={{
            name: filterInputsNames["maintainer-search"],
            value: queryParams["maintainer-search"],
          }}
          value={queryParams.maintainer}
          groupName="maintainers"
          onchange={submitFilters}
          aria-labelledby={maintainerLabelId}
        />
      </div>
      <div class="filter">
        <span id={signerLabelId}>{labels.signer}:</span>
        <PersonFilterCombobox
          name={filterInputsNames.signer}
          searchInputProps={{
            name: filterInputsNames["signer-search"],
            value: queryParams["signer-search"],
          }}
          value={queryParams.signer}
          groupName="signers"
          onchange={submitFilters}
          aria-labelledby={signerLabelId}
        />
      </div>
      <div class="filter">
        <span id={seriesLabelId}>{labels.series}:</span>
        <SeriesFilterMenu
          name={filterInputsNames.series}
          value={queryParams.series}
          onchange={submitFilters}
          aria-labelledby={seriesLabelId}
          {seriesGroups}
        />
      </div>
      <div class="filter">
        <span id={pocketLabelId}>{labels.pocket}:</span>
        <PocketFilterMenu
          name={filterInputsNames.pocket}
          value={queryParams.pocket}
          onchange={submitFilters}
          aria-labelledby={pocketLabelId}
        />
      </div>
      <div class="filter-controls">
        <div class="filter">
          <span id={moreFiltersLabelId} class="visually-hidden"
            >{labels.moreFilters}:</span
          >
          <MoreFiltersMenu
            switches={[
              {
                name: filterInputsNames["ubuntu-change"],
                text: labels.ubuntuChange,
                checked: queryParams["ubuntu-change"],
              },
              {
                name: filterInputsNames["all-statuses"],
                text: labels.allStatuses,
                checked: queryParams["all-statuses"],
              },
            ]}
            aria-labelledby={moreFiltersLabelId}
          />
        </div>
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

  .search {
    display: flex;
    align-items: center;
    border-block-end: var(--filters-separator);
    padding-block-start: var(--dimension-050);

    :global {
      .search-box {
        flex-grow: 1;

        > input {
          min-width: 160px;
        }
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

    .search {
      align-self: start;
      border-block-end: none;
      flex: none;

      :global {
        .search-box {
          flex: none;
          inline-size: 160px;
        }
      }
    }

    .filters {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      row-gap: var(--dimension-050);
      padding-block: calc(var(--dimension-050) + var(--dimension-025));

      &::before {
        position: absolute;
        content: "";
        display: block;
        inline-size: var(--dimension-stroke-thickness-medium);
        inset-inline-start: 0;
        inset-block: var(--dimension-100);
        background-color: var(--color-border-muted);
      }

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
