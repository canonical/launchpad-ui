<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import type { Snippet } from "svelte";
  import { TableViewBar } from "#lib/components/TableViewBar/index.js";
  import { getPackagesContext } from "#lib/modules/packages/context.js";
  import Filters from "#lib/modules/packages/filters/Filters.svelte";
  import FiltersSummary from "#lib/modules/packages/filters/FiltersSummary.svelte";
  import type { PackageFilterInputs } from "#lib/modules/packages/filters/inputs.js";
  import type { PackagesFilters } from "#lib/modules/packages/filters/schema.js";
  import { toPackagesFilters } from "#lib/modules/packages/superhref.js";
  import ManageViewsSidePanel from "#lib/modules/packages/table-views/ManageViewsSidePanel.svelte";
  import { resolveTableView } from "#lib/modules/packages/table-views/resolveTableView.js";
  import { getTableViews } from "#lib/modules/packages/table-views/table-views.remote.js";
  import { page } from "$app/state";

  const {
    filters,
    table,
  }: {
    filters: Snippet<[PackageFilterInputs]>;
    table: Snippet<[PackagesFilters]>;
  } = $props();

  const context = getPackagesContext();
  const distro = $derived(context.distro);
  const queryParams = $derived(context.queryParams);
  const storedTableViews = $derived(await getTableViews(distro));
  const tableViews = $derived(page.state.tableViews ?? storedTableViews);
  const resolvedView = $derived(
    resolveTableView(
      queryParams.view,
      tableViews,
      toPackagesFilters(queryParams),
    ),
  );
</script>

<TableViewBar
  current={resolvedView.view.slug}
  items={tableViews.map(({ name, slug }) => ({
    text: name,
    href: queryParams.setView(slug),
    key: slug,
  }))}
  label="Packages table views"
>
  {#snippet trailing()}
    <Button
      aria-label="Manage package table views"
      href={queryParams.set("panel", "manage-views")}
      importance="tertiary"
    >
      {#snippet iconLeft()}<SettingsIcon />{/snippet}
    </Button>
  {/snippet}
</TableViewBar>
{#if resolvedView.isDefaultView}
  <Filters {filters} />
{:else}
  <FiltersSummary tableView={resolvedView.view} />
{/if}
{@render table(resolvedView.filters)}
<ManageViewsSidePanel open={queryParams.panel === "manage-views"} {filters} />
