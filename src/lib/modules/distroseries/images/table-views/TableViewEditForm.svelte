<script lang="ts">
  import { Button, TextInput } from "@canonical/svelte-ds-app-launchpad";
  import type { TextInputProps } from "@canonical/svelte-ds-app-launchpad";
  import * as v from "valibot";
  import { filtersDiffer } from "#lib/modules/filtering/utils.js";
  import { MAX_TABLE_VIEW_NAME_LENGTH } from "#lib/modules/table-views/constants.js";
  import { subId } from "#lib/utils/index.js";
  import BuildStatusFilterMenu from "../filters/BuildStatusFilterMenu.svelte";
  import ProductFilterMenu from "../filters/ProductFilterMenu.svelte";
  import TestStatusFilterMenu from "../filters/TestStatusFilterMenu.svelte";
  import { IMAGES_FILTER_LABELS as labels } from "../filters/constants.js";
  import {
    TableViewEditFormSchema,
    TableViewSettingsSchema,
  } from "./schema.js";
  import type { TableViewSettings } from "./schema.js";
  import type { createTableView, editTableView } from "./table-views.remote.js";
  import { browser } from "$app/env";

  const {
    form,
    distro,
    settings,
    heading,
    cancelHref,
    onstage,
    requireChange = true,
  }: {
    form: ReturnType<typeof editTableView.for> | typeof createTableView;
    /** The distro whose table views are edited. */
    distro: string;
    /** The settings to start editing from. */
    settings: TableViewSettings;
    heading: string;
    cancelHref: string;
    /** Called with JS instead of submitting, so the edit is saved with the rest of the panel. */
    onstage: (settings: TableViewSettings) => void;
    /** Whether confirming is disabled until `settings` are changed. */
    requireChange?: boolean;
  } = $props();

  const id = $props.id();
  const productLabelId = subId(id, "product-label");
  const buildStatusLabelId = subId(id, "build-status-label");
  const testStatusLabelId = subId(id, "test-status-label");
  const nameId = subId(id, "name");

  const fields = $derived(form.fields);

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
    return (
      result.success &&
      result.output.name === settings.name &&
      !filtersDiffer(result.output.filters, settings.filters)
    );
  });
  const submitDisabled = $derived(browser && requireChange && isUnchanged);

  // Add form keeps its values, so clear it when closed
  $effect(() => () => {
    form.fields.set({});
  });
</script>

<form
  {...form.preflight(TableViewEditFormSchema).enhance(({ fields }) => {
    onstage(v.parse(TableViewSettingsSchema, fields.value()));
  })}
>
  <!-- Without JS, Enter in a text field submits with the first submit button, so it must confirm rather than search -->
  <button
    type="submit"
    class="visually-hidden"
    tabindex="-1"
    aria-hidden="true"
    disabled={submitDisabled}
  ></button>
  <input {...fields.distro.as("hidden", distro)} />
  <h4>{heading}</h4>

  <!-- 
    A fieldset would be more appropriate here, but there is a bug in Chrome, where it doesn't properly propagate subgrid column definitions: https://issues.chromium.org/issues/40278914
    
    TODO: Use fieldset instead of divs once the above issue is fixed.
  -->
  <div class="filter-group" aria-label="Filters">
    <span id={productLabelId}>{labels.product}</span>
    <ProductFilterMenu
      {...fields.filters.product.as("select")}
      aria-labelledby={productLabelId}
    />

    <span id={buildStatusLabelId}>{labels.buildStatus}</span>
    <BuildStatusFilterMenu
      {...fields.filters.buildStatus.as("select")}
      aria-labelledby={buildStatusLabelId}
    />

    <span id={testStatusLabelId}>{labels.testStatus}</span>
    <TestStatusFilterMenu
      {...fields.filters.testStatus.as("select")}
      aria-labelledby={testStatusLabelId}
    />

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
    }

    .more-filters-label {
      align-self: start;
    }

    .more-filters {
      display: flex;
      flex-direction: column;
      gap: var(--dimension-100);
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
