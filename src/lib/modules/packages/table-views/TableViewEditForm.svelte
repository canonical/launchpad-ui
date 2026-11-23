<script lang="ts">
  import { Button, TextInput } from "@canonical/svelte-ds-app-launchpad";
  import type { TextInputProps } from "@canonical/svelte-ds-app-launchpad";
  import type { Snippet } from "svelte";
  import * as v from "valibot";
  import { filtersDiffer } from "#lib/modules/filtering/utils.js";
  import { MAX_TABLE_VIEW_NAME_LENGTH } from "#lib/modules/table-views/constants.js";
  import { subId } from "#lib/utils/index.js";
  import type { PackageFilterInputs } from "../filters/inputs.js";
  import {
    TableViewEditFormSchema,
    TableViewSettingsSchema,
  } from "./schema.js";
  import type { TableViewSettings } from "./schema.js";
  import type { createTableView, editTableView } from "./table-views.remote.js";
  import { browser } from "$app/env";
  import type { RemoteFormField } from "$app/server";

  const {
    form,
    distro,
    settings,
    heading,
    cancelHref,
    onstage,
    requireChange = true,
    filters,
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
    filters: Snippet<[PackageFilterInputs]>;
  } = $props();

  const id = $props.id();
  const nameId = subId(id, "name");

  const fields = $derived(form.fields);

  // Seeded once; values kept from a no-JS submission (e.g. a person search) take precedence
  // svelte-ignore state_referenced_locally
  if (Object.keys(fields.value()).length === 0)
    fields.set({
      name: settings.name,
      filters: { ...settings.filters },
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

  // Kit types a variant's discriminator as a union of fields, whose `.as()` TypeScript can't call; widen it to one field
  const intent: RemoteFormField<
    NonNullable<v.InferInput<typeof TableViewEditFormSchema>["intent"]>
  > = $derived(fields.intent);

  const inputs: PackageFilterInputs = {
    value: (key) => {
      const field = fields.filters[key] as RemoteFormField<string>;
      const { name, value, "aria-invalid": ariaInvalid } = field.as("select");
      return { name, value, "aria-invalid": ariaInvalid };
    },
    toggle: (key) => {
      const { name, checked } = fields.filters[key].as("checkbox");
      return { name, checked };
    },
    personSearch: (key) => ({
      searchInputProps: fields[`${key}Search`].as("text"),
      searchButtonProps: intent.as("submit", `search-${key}`),
    }),
    position: "block-end span-inline-start",
  };
</script>

<form
  {...form.preflight(TableViewEditFormSchema).enhance(({ fields }) => {
    // Other submit buttons, like the search one, mustn't bypass the disabled Confirm
    if (submitDisabled) return;
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

  {@render filters(inputs)}

  <div class="name">
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
    display: flex;
    flex-direction: column;
    gap: var(--dimension-200);
    padding: var(--dimension-200);
    margin-block: var(--dimension-100);

    border: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

    h4 {
      font: inherit;
      font-weight: var(--typography-text-primary-bold-font-weight);
    }

    .name {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: var(--dimension-200);
      align-items: center;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dimension-200);
    }
  }
</style>
