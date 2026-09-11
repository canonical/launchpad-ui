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
    TABLE_VIEWS,
    preservedParams,
  } from "$lib/modules/packages/superhref.js";
  import type { PageProps } from "./$types.js";
  import {
    getSourcePackages,
    getSourcePackagesTotal,
  } from "./packages.remote.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const { params }: PageProps = $props();

  const PAGE_SIZES = [10, 25, 50, 100];

  const queryParams = $derived(QueryParams.bind(page.url));
  setPackagesContext({
    get queryParams() {
      return queryParams;
    },
  });

  const { data, hasNext } = $derived(
    await getSourcePackages({
      distro: params.pillar,
      series: queryParams.series ?? undefined,
      sortKey: queryParams.sort.key,
      sortOrder: queryParams.sort.direction,
      page: queryParams.page,
      size: queryParams["page-size"],
    }),
  );

  const total = $derived(
    (await getSourcePackagesTotal({
      distro: params.pillar,
      series: queryParams.series ?? undefined,
    })) ?? undefined,
  );

  const totalPages = $derived(
    total === undefined
      ? undefined
      : Math.max(1, Math.ceil(total / queryParams["page-size"])),
  );
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
    items={TABLE_VIEWS.map(({ name, slug }) => ({
      text: name,
      href: queryParams.setView(slug),
      key: slug,
    }))}
    label="Packages table views"
    >{#snippet trailing()}
      <Button aria-label="Manage package table views" disabled severity="base">
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
          <!-- TODO Replace when filters land -->
          {#if filter === "Series" && queryParams.series !== null}
            <option>{queryParams.series}</option>
          {:else}
            <option>All</option>
          {/if}
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
                  href={queryParams.patch({ sort: next, page: 1 })}
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
            - {item.source_package_version}
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
      <form
        method="GET"
        class="pagination-form"
        data-sveltekit-noscroll
        data-sveltekit-keepfocus
      >
        {#each preservedParams( page.url, ["page-size", "page"], ) as [name, value], index (index)}
          <input type="hidden" {name} {value} />
        {/each}
        <Pagination.ItemsPerPageSelect
          name="page-size"
          value={queryParams["page-size"]}
          onchange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          {#each PAGE_SIZES as size (size)}
            <option value={size}>{size}</option>
          {/each}
          {#if !PAGE_SIZES.some((size) => size === queryParams["page-size"])}
            <option value={queryParams["page-size"]}>
              {queryParams["page-size"]}
            </option>
          {/if}
        </Pagination.ItemsPerPageSelect>
        <span class="no-js-only">
          <Button type="submit" severity="base">Apply</Button>
        </span>
      </form>
      <Pagination.ItemsCount showing={data.length} {total} />
    {/snippet}
    {#snippet rightGroup()}
      <form method="GET" class="pagination-form" data-sveltekit-keepfocus>
        {#each preservedParams( page.url, ["page"], ) as [name, value], index (index)}
          <input type="hidden" {name} {value} />
        {/each}
        <Pagination.PageInput
          name="page"
          value={queryParams.page}
          {totalPages}
        />
        <span class="no-js-only">
          <Button type="submit" severity="base">Go</Button>
        </span>
      </form>
    {/snippet}
    <Pagination.PageNavigation
      direction="first"
      href={queryParams.set("page", 1)}
      disabled={queryParams.page === 1}
      data-sveltekit-keepfocus
    />
    <Pagination.PageNavigation
      direction="previous"
      href={queryParams.set("page", queryParams.page - 1)}
      disabled={queryParams.page === 1}
      data-sveltekit-keepfocus
    />
    <Pagination.PageNavigation
      direction="next"
      href={queryParams.set("page", queryParams.page + 1)}
      disabled={!hasNext}
      data-sveltekit-keepfocus
    />
    <Pagination.PageNavigation
      direction="last"
      href={queryParams.set("page", totalPages ?? queryParams.page)}
      disabled={totalPages === undefined || queryParams.page >= totalPages}
      data-sveltekit-keepfocus
    />
  </Pagination>
</main>

<BinaryPackageSidePanel name={queryParams["binary-package"]} />

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

    .pagination-form {
      display: flex;
      align-items: stretch;
    }

    .no-js-only {
      display: none;
    }

    @media (scripting: none) {
      .no-js-only {
        display: contents;
      }
    }
  }
</style>
