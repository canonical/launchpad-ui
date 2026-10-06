<script lang="ts" module>
  import type { PackagesFilters } from "../filters/schema.js";
  import type { TableViewSettings } from "./schema.js";

  function areTableViewSettingsEqual(
    a: TableViewSettings,
    b: TableViewSettings,
  ): boolean {
    return (
      a.name === b.name &&
      (Object.keys(a.filters) as (keyof PackagesFilters)[]).every(
        (key) => a.filters[key] === b.filters[key],
      )
    );
  }
</script>

<script lang="ts">
  import {
    Button,
    Checkbox,
    TextInput,
  } from "@canonical/svelte-ds-app-launchpad";
  import type { TextInputProps } from "@canonical/svelte-ds-app-launchpad";
  import type { RemoteFormField } from "@sveltejs/kit";
  import { untrack } from "svelte";
  import * as v from "valibot";
  import { preserveQueryParams, subId } from "$lib/utils/index.js";
  import PersonFilterCombobox from "../filters/PersonFilterCombobox.svelte";
  import PocketFilterMenu from "../filters/PocketFilterMenu.svelte";
  import SearchModeMenu from "../filters/SearchModeMenu.svelte";
  import SeriesFilterMenu from "../filters/SeriesFilterMenu.svelte";
  import {
    MAX_PACKAGES_SEARCH_LENGTH,
    PACKAGES_FILTER_LABELS as labels,
  } from "../filters/constants.js";
  import { MAX_TABLE_VIEW_NAME_LENGTH } from "./constants.js";
  import type { TableView } from "./constants.js";
  import {
    TableViewEditFormSchema,
    TableViewSettingsSchema,
  } from "./schema.js";
  import { editTableView } from "./table-views.remote.js";
  import { browser } from "$app/env";
  import { page } from "$app/state";

  const {
    view,
    settings,
    cancelHref,
    onstage,
  }: {
    view: TableView;
    /** The settings to start editing from. */
    settings: TableViewSettings;
    cancelHref: string;
    /** Called with JS instead of submitting, so the edit is saved with the rest of the panel. */
    onstage: (settings: TableViewSettings) => void;
  } = $props();

  const id = $props.id();
  const formId = subId(id, "form");
  const searchModeLabelId = subId(id, "search-mode-label");
  const keywordId = subId(id, "keyword");
  const maintainerLabelId = subId(id, "maintainer-label");
  const signerLabelId = subId(id, "signer-label");
  const seriesLabelId = subId(id, "series-label");
  const pocketLabelId = subId(id, "pocket-label");
  const nameId = subId(id, "name");
  const moreFiltersLabelId = subId(id, "more-filters-label");

  const editForm = $derived(editTableView.for(view.slug));
  const fields = $derived(editForm.fields);

  // Seeded once; values kept from a no-JS submission (e.g. a person search) take precedence
  untrack(() => {
    if (Object.keys(fields.value()).length > 0) return;
    fields.set({
      name: settings.name,
      // Form fields can't hold `null`, so "All" becomes `""`
      filters: {
        search: settings.filters.search ?? "",
        match: settings.filters.match,
        series: settings.filters.series ?? "",
        pocket: settings.filters.pocket ?? "",
        maintainer: settings.filters.maintainer ?? "",
        signer: settings.filters.signer ?? "",
        ubuntuChange: settings.filters.ubuntuChange,
        allStatuses: settings.filters.allStatuses,
      },
    });
  });

  const isUnchanged = $derived.by(() => {
    const result = v.safeParse(TableViewSettingsSchema, fields.value());
    return result.success && areTableViewSettingsEqual(result.output, settings);
  });

  // Kit types a variant's discriminator as a union of fields, whose `.as()` TypeScript can't call; widen it to one field
  const intent: RemoteFormField<
    NonNullable<v.InferInput<typeof TableViewEditFormSchema>["intent"]>
  > = $derived(fields.intent);
</script>

<form
  id={formId}
  {...preserveQueryParams(
    editForm.preflight(TableViewEditFormSchema).enhance(({ fields }) => {
      onstage(v.parse(TableViewSettingsSchema, fields.value()));
    }),
    page.url,
  )}
>
  <!-- Without JS, Enter in a text field submits with the first submit button, so it must confirm rather than search -->
  <button type="submit" class="visually-hidden" tabindex="-1" aria-hidden="true"
  ></button>
  <h4>Editing – {view.name}</h4>

  <!-- 
    A fieldset would be more appropriate here, but there is a bug in Chrome, where it doesn't properly propagate subgrid column definitions: https://issues.chromium.org/issues/40278914
    
    TODO: Use fieldset instead of divs once the above issue is fixed.
  -->
  <div class="filter-group" aria-label="Search">
    <span id={searchModeLabelId}>{labels.match}</span>
    <SearchModeMenu
      {...fields.filters.match.as("select")}
      aria-labelledby={searchModeLabelId}
      position="block-end span-inline-start"
    />

    <label for={keywordId}>{labels.search}</label>
    <TextInput
      id={keywordId}
      maxlength={MAX_PACKAGES_SEARCH_LENGTH}
      {...fields.filters.search.as("text") as TextInputProps}
    />
  </div>

  <div class="filter-group" aria-label="Filters">
    <span id={maintainerLabelId}>{labels.maintainer}</span>

    <PersonFilterCombobox
      {...fields.filters.maintainer.as("select")}
      searchInputProps={fields.maintainerSearch.as("text")}
      searchButtonProps={intent.as("submit", "search-maintainer")}
      groupName="maintainers"
      aria-labelledby={maintainerLabelId}
      position="block-end span-inline-start"
    />

    <span id={signerLabelId}>{labels.signer}</span>

    <PersonFilterCombobox
      {...fields.filters.signer.as("select")}
      searchInputProps={fields.signerSearch.as("text")}
      searchButtonProps={intent.as("submit", "search-signer")}
      groupName="signers"
      aria-labelledby={signerLabelId}
      position="block-end span-inline-start"
    />

    <span id={seriesLabelId}>{labels.series}</span>
    <SeriesFilterMenu
      {...fields.filters.series.as("select")}
      aria-labelledby={seriesLabelId}
      position="block-end span-inline-start"
    />

    <span id={pocketLabelId}>{labels.pocket}</span>
    <PocketFilterMenu
      {...fields.filters.pocket.as("select")}
      aria-labelledby={pocketLabelId}
      position="block-end span-inline-start"
    />

    <span id={moreFiltersLabelId} class="more-filters-label"
      >{labels.moreFilters}</span
    >
    <div class="more-filters">
      <label>
        <div>
          <Checkbox {...fields.filters.ubuntuChange.as("checkbox")} />
        </div>
        {labels.ubuntuChange}
      </label>
      <label>
        <div>
          <Checkbox {...fields.filters.allStatuses.as("checkbox")} />
        </div>
        {labels.allStatuses}
      </label>
    </div>
  </div>

  <div class="filter-group">
    <label for={nameId}>* View name</label>
    <TextInput
      id={nameId}
      aria-required="true"
      // Without JS, the person searches submit this form too, and mustn't be blocked by an unfinished name
      required={browser}
      maxlength={MAX_TABLE_VIEW_NAME_LENGTH}
      {...fields.name.as("text") as TextInputProps}
    />
  </div>

  <div class="actions">
    <Button href={cancelHref} importance="tertiary">Cancel</Button>
    <Button
      type="submit"
      importance="secondary"
      disabled={browser && isUnchanged}
    >
      Confirm
    </Button>
  </div>
</form>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: var(--dimension-200);
    column-gap: var(--dimension-200);
    padding: var(--dimension-200);
    margin-block: var(--dimension-100);

    border: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    h4 {
      font: inherit;
      font-weight: var(--typography-text-primary-bold-font-weight);
      grid-column: 1 / -1;
    }

    .filter-group {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      row-gap: var(--dimension-150);
      align-items: center;

      + .filter-group {
        padding-top: var(--dimension-200);
        border-top: var(--dimension-stroke-thickness-medium) solid
          var(--color-border-muted);
      }
    }

    .more-filters-label {
      align-self: start;
    }

    .more-filters {
      display: flex;
      flex-direction: column;
      gap: var(--dimension-100);

      > label {
        > div {
          height: 1lh;
          display: grid;
          place-items: center;
        }

        display: flex;
        align-items: start;
        gap: var(--dimension-200);
      }
    }

    .actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: var(--dimension-200);
    }

    :global {
      .options-panel {
        margin-block-start: var(--dimension-050);
      }
    }
  }
</style>
