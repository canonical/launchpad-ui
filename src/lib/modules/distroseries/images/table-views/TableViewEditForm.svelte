<script lang="ts" module>
  import type { ImagesFilter } from "$lib/server/image-provider/types.js";

  function areTableViewSettingsEqual(
    a: TableViewSettings,
    b: TableViewSettings,
  ): boolean {
    return (
      a.name === b.name &&
      (Object.keys(a.filters) as (keyof ImagesFilter)[]).every(
        (key) => a.filters[key] === b.filters[key],
      )
    );
  }
</script>

<script lang="ts">
  import { Button, TextInput } from "@canonical/svelte-ds-app-launchpad";
  import type { TextInputProps } from "@canonical/svelte-ds-app-launchpad";
  import * as v from "valibot";
  import { MAX_TABLE_VIEW_NAME_LENGTH } from "$lib/modules/table-views/constants.js";
  import { preserveQueryParams, subId } from "$lib/utils/index.js";
  import { IMAGE_FILTERS } from "../constants.js";
  import BuildStatusFilterMenu from "../filters/BuildStatusFilterMenu.svelte";
  import ProductFilterMenu from "../filters/ProductFilterMenu.svelte";
  import TestStatusFilterMenu from "../filters/TestStatusFilterMenu.svelte";
  import type { TableView } from "./constants.js";
  import {
    TableViewEditFormSchema,
    TableViewSettingsSchema,
  } from "./schema.js";
  import type { TableViewSettings } from "./schema.js";
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
  const productLabelId = subId(id, "product-label");
  const buildStatusLabelId = subId(id, "build-status-label");
  const testStatusLabelId = subId(id, "test-status-label");
  const nameId = subId(id, "name");

  const editForm = $derived(editTableView.for(view.slug));
  const fields = $derived(editForm.fields);

  // Seeded once; values kept from a no-JS submission (e.g. a person search) take precedence
  // svelte-ignore state_referenced_locally
  if (Object.keys(fields.value()).length === 0)
    fields.set({
      name: settings.name,
      // Form fields can't hold `null`, so "All" becomes `""`
      filters: {
        product: settings.filters.product ?? "",
        buildStatus: settings.filters.buildStatus ?? "",
        testStatus: settings.filters.testStatus ?? "",
      },
    });

  const isUnchanged = $derived.by(() => {
    const result = v.safeParse(TableViewSettingsSchema, fields.value());
    return result.success && areTableViewSettingsEqual(result.output, settings);
  });
  const submitDisabled = $derived(browser && isUnchanged);
</script>

<form
  {...preserveQueryParams(
    editForm.preflight(TableViewEditFormSchema).enhance(({ fields }) => {
      onstage(v.parse(TableViewSettingsSchema, fields.value()));
    }),
    page.url,
  )}
>
  <!-- Without JS, Enter in a text field submits with the first submit button, so it must confirm rather than search -->
  <button
    type="submit"
    class="visually-hidden"
    tabindex="-1"
    aria-hidden="true"
    disabled={submitDisabled}
  ></button>
  <h4>Editing – {view.name}</h4>

  <div class="filter-group" aria-label="Filters">
    <span id={productLabelId}>{IMAGE_FILTERS.product.label}:</span>
    <ProductFilterMenu
      {...fields.filters.product.as("select")}
      aria-labelledby={productLabelId}
    />

    <span id={buildStatusLabelId}>{IMAGE_FILTERS.buildStatus.label}:</span>
    <BuildStatusFilterMenu
      {...fields.filters.buildStatus.as("select")}
      aria-labelledby={buildStatusLabelId}
    />

    <span id={testStatusLabelId}>{IMAGE_FILTERS.testStatus.label}:</span>
    <TestStatusFilterMenu
      {...fields.filters.testStatus.as("select")}
      aria-labelledby={testStatusLabelId}
    />
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
    <Button type="submit" importance="secondary" disabled={submitDisabled}>
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
