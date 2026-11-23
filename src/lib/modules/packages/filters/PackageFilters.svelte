<script lang="ts">
  import { SearchBox } from "@canonical/svelte-ds-app-launchpad";
  import type { SeriesGroups } from "#lib/modules/filtering/types.js";
  import { subId } from "#lib/utils/index.js";
  import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
  import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
  import PocketFilterMenu from "./PocketFilterMenu.svelte";
  import SearchModeMenu from "./SearchModeMenu.svelte";
  import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
  import {
    MAX_PACKAGES_SEARCH_LENGTH,
    PACKAGES_FILTER_LABELS as labels,
  } from "./constants.js";
  import type { PackageFilterInputs } from "./inputs.js";

  const {
    inputs,
    seriesGroups,
  }: {
    inputs: PackageFilterInputs;
    seriesGroups: SeriesGroups;
  } = $props();

  const id = $props.id();
  const searchModeLabelId = subId(id, "search-mode-label");
  const maintainerLabelId = subId(id, "maintainer-label");
  const signerLabelId = subId(id, "signer-label");
  const seriesLabelId = subId(id, "series-label");
  const pocketLabelId = subId(id, "pocket-label");
  const moreFiltersLabelId = subId(id, "more-filters-label");

  const controlProps = $derived({
    onchange: inputs.onchange,
    position: inputs.position,
  });
</script>

<!-- TODO: Use the common Filters component once
https://warthogs.atlassian.net/browse/LP-5118 lands -->

<div class="package-filters">
  <div class="layout">
    <div class="search">
      <span id={searchModeLabelId} class="visually-hidden">{labels.match}:</span
      >
      <SearchModeMenu
        {...inputs.value("match")}
        {...controlProps}
        aria-labelledby={searchModeLabelId}
      />
      <!-- TODO(DAL): Style the searchbox according to the design -->
      <SearchBox
        {...inputs.value("search")}
        maxlength={MAX_PACKAGES_SEARCH_LENGTH}
        placeholder="Search"
        aria-label="Search packages"
        class="search-box"
      />
    </div>
    <div class="filters">
      <div class="filter">
        <span id={maintainerLabelId}>{labels.maintainer}:</span>
        <PersonFilterCombobox
          {...inputs.value("maintainer")}
          {...inputs.personSearch("maintainer")}
          {...controlProps}
          groupName="maintainers"
          aria-labelledby={maintainerLabelId}
        />
      </div>
      <div class="filter">
        <span id={signerLabelId}>{labels.signer}:</span>
        <PersonFilterCombobox
          {...inputs.value("signer")}
          {...inputs.personSearch("signer")}
          {...controlProps}
          groupName="signers"
          aria-labelledby={signerLabelId}
        />
      </div>
      <div class="filter">
        <span id={seriesLabelId}>{labels.series}:</span>
        <SeriesFilterMenu
          {...inputs.value("series")}
          {...controlProps}
          aria-labelledby={seriesLabelId}
          {seriesGroups}
        />
      </div>
      <div class="filter">
        <span id={pocketLabelId}>{labels.pocket}:</span>
        <PocketFilterMenu
          {...inputs.value("pocket")}
          {...controlProps}
          aria-labelledby={pocketLabelId}
        />
      </div>
      <div class="filter">
        <span id={moreFiltersLabelId} class="visually-hidden"
          >{labels.moreFilters}:</span
        >
        <MoreFiltersMenu
          switches={[
            { ...inputs.toggle("ubuntuChange"), text: labels.ubuntuChange },
            { ...inputs.toggle("allStatuses"), text: labels.allStatuses },
          ]}
          {...controlProps}
          aria-labelledby={moreFiltersLabelId}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .package-filters {
    container-type: inline-size;
    flex-grow: 1;

    --filters-separator: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    :global(.options-panel) {
      margin-block-start: var(--dimension-050);
    }
  }

  .layout {
    display: flex;
    flex-direction: column;
    column-gap: var(--dimension-050);
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

      > span:not(.visually-hidden) {
        color: var(--color-text-muted);
        white-space: nowrap;
        flex: 1;
      }
    }
  }

  @container (min-width: 600px) {
    .layout {
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
    }
  }
</style>
