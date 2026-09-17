<script lang="ts">
  import {
    Breadcrumbs,
    Button,
    Link,
    SearchBox,
    Select,
    Table,
  } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import { Pagination, TableViewBar } from "$lib/components/index.js";
  import BinaryPackageSidePanel from "$lib/modules/packages/BinaryPackageSidePanel/BinaryPackageSidePanel.svelte";
  import { setPackagesContext } from "$lib/modules/packages/context.js";
  import {
    PACKAGES_TABLE_COLUMNS,
    QueryParams,
  } from "$lib/modules/packages/superhref.js";
  import ManageViewsSidePanel from "$lib/modules/packages/table-views/ManageViewsSidePanel.svelte";
  import { getTableViews } from "$lib/modules/packages/table-views/table-views.remote.js";
  import type { PageProps } from "./$types.js";
  import { getSourcePackages } from "./packages.remote.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const { params }: PageProps = $props();

  // TODO: Implement pagination and total count from API
  const PAGE = 1;
  const PAGE_SIZE = 25;
  const TOTAL = 100;

  const queryParams = $derived(QueryParams.bind(page.url));
  setPackagesContext({
    get queryParams() {
      return queryParams;
    },
  });

  const sourcePackagesPromise = $derived(
    getSourcePackages({
      distro: params.pillar,
      sortKey: queryParams.sort.key,
      sortOrder: queryParams.sort.direction,
      page: PAGE,
      size: PAGE_SIZE,
    }),
  );
  const tableViewsPromise = $derived(getTableViews());

  const data = $derived(await sourcePackagesPromise);
  const tableViews = $derived(await tableViewsPromise);
</script>

<svelte:head>
  <title>{params.pillar} packages — Launchpad</title>
</svelte:head>

<!-- TODO(@Enzo): Mobile layout -->
<main>
  <Breadcrumbs
    segments={[
      {
        label: params.pillar,
        href: resolve("/[pillar]", { pillar: params.pillar }),
        style: "text-transform: capitalize;",
      },
      {
        label: "Packages",
      },
    ]}
    class="breadcrumbs"
  />
  <h1>Packages</h1>
  <TableViewBar
    current={queryParams.view}
    items={tableViews.map(({ name, slug }) => ({
      text: name,
      href: queryParams.setView(slug),
      key: slug,
    }))}
    label="Packages table views"
    >{#snippet trailing()}
      <Button
        aria-label="Manage package table views"
        severity="base"
        href={queryParams.set("panel", "manage-views")}
      >
        {#snippet iconLeft()}
          <SettingsIcon />
        {/snippet}
      </Button>
    {/snippet}
  </TableViewBar>
  <div class="filters">
    <SearchBox
      placeholder="Search"
      aria-label="Search packages"
      class="packages-search"
      disabled
    />
    {#each ["Status", "Series", "Pocket", "Component", "Set"] as filter (filter)}
      <label>
        <span class="label-text">{filter}:</span>
        <Select severity="base" class="packages-filter" disabled>
          <option>All</option>
        </Select>
      </label>
    {/each}
  </div>

  <Table class="packages-table">
    <thead>
      <tr>
        {#each PACKAGES_TABLE_COLUMNS as column (column.key)}
          <Table.TH
            scope="col"
            class={column.key}
            aria-sort={column.sortable
              ? queryParams.sort.key === column.key
                ? queryParams.sort.direction
                : "none"
              : undefined}
          >
            {column.label}
            {#snippet action()}
              {#if column.sortable}
                {const next = $derived(queryParams.sort.cycle(column.key))}
                <Table.TH.SortButton
                  href={queryParams.set("sort", next)}
                  aria-label={next.direction === "none"
                    ? `Remove sorting by ${column.label}`
                    : `Sort by ${column.label} ${next.direction}`}
                  data-sveltekit-noscroll
                  data-sveltekit-keepfocus
                />
              {/if}
            {/snippet}
          </Table.TH>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as item (item.self_link)}
        <tr>
          <th scope="row">
            <Link
              href={resolve("/[pillar]/+source/[name]", {
                pillar: params.pillar,
                name: item.source_package_name,
              })}
              soft
            >
              {item.source_package_name}
            </Link>
          </th>
          <td>{item.distro_series_link.split("/").pop() ?? ""}</td>
          <td>{item.pocket}</td>
          <td></td>
          <td>{item.status}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
  <Pagination class="pagination">
    {#snippet leftGroup()}
      <Pagination.ItemsPerPageSelect disabled>
        <option value={10}>10</option>
        <option value={25} selected>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Pagination.ItemsPerPageSelect>
      <Pagination.ItemsCount showing={data.length} total={TOTAL} />
    {/snippet}
    {#snippet rightGroup()}
      <Pagination.PageInput
        value={PAGE}
        totalPages={Math.ceil(TOTAL / PAGE_SIZE) || 1}
        disabled
      />
    {/snippet}
    <Pagination.PageNavigation direction="first" disabled />
    <Pagination.PageNavigation direction="previous" disabled />
    <Pagination.PageNavigation direction="next" disabled />
    <Pagination.PageNavigation direction="last" disabled />
  </Pagination>
</main>

<BinaryPackageSidePanel name={queryParams["binary-package"]} />
<ManageViewsSidePanel
  open={queryParams.panel === "manage-views"}
  items={tableViews}
/>

<style>
  main {
    padding: var(--lp-dimension-spacing-block-m)
      var(--lp-dimension-spacing-inline-l);

    :global(.breadcrumbs) {
      padding: 0;
      margin-block-end: var(--lp-dimension-spacing-block-xs);
    }

    h1 {
      margin-block-end: var(--lp-dimension-spacing-block-m);
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--lp-dimension-spacing-inline-m);
      margin-block: var(--lp-dimension-spacing-block-m);
      align-items: center;

      :global(.packages-search) {
        flex-basis: 318px;
      }

      .label-text {
        color: var(--lp-color-text-muted);
      }

      :global(.packages-filter) {
        font: var(--lp-typography-paragraph-s);
      }
    }

    :global(.packages-table) {
      width: 100%;
      table-layout: fixed;

      :global {
        td,
        th {
          vertical-align: top;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        thead th {
          &.source-package {
            width: 22%;
          }
          &.series {
            width: 16%;
          }
          &.pocket {
            width: 10%;
          }
          &.binary-packages {
            width: 42%;
          }
          &.status {
            width: 10%;
          }
        }
      }

      tbody {
        th {
          font-weight: var(--lp-typography-weight-regular);
        }
      }

      :global {
        .package-link {
          /* TODO(DAL): We should probably have an `underline` prop on the Link component similar to `soft`. */
          text-decoration: underline;

          &:not(:last-child) {
            margin-inline-end: var(--lp-dimension-spacing-inline-xs);
          }
        }
      }
    }

    :global(.pagination) {
      position: sticky;
      bottom: 0;
    }
  }
</style>
