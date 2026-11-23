<script lang="ts">
  import {
    Checkbox,
    SearchBox,
    TextInput,
  } from "@canonical/svelte-ds-app-launchpad";
  import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
  import PersonFilterCombobox from "./PersonFilterCombobox.svelte";
  import PocketFilterMenu from "./PocketFilterMenu.svelte";
  import SearchModeMenu from "./SearchModeMenu.svelte";
  import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
  import type { PackageFilterControl } from "./controls.js";

  const { control }: { control: PackageFilterControl } = $props();
</script>

{#if control.kind === "match"}
  <SearchModeMenu {...control.props} />
{:else if control.kind === "search" && control.mode === "bar"}
  <SearchBox {...control.props} />
{:else if control.kind === "search"}
  <TextInput {...control.props} />
{:else if control.kind === "maintainer" || control.kind === "signer"}
  <PersonFilterCombobox {...control.props} />
{:else if control.kind === "series"}
  <SeriesFilterMenu {...control.props} />
{:else if control.kind === "pocket"}
  <PocketFilterMenu {...control.props} />
{:else if control.kind === "more"}
  <MoreFiltersMenu {...control.props} />
{:else if control.kind === "ubuntuChange" || control.kind === "allStatuses"}
  <Checkbox {...control.props} />
{/if}
