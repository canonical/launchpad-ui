<script lang="ts">
  import { Button, Link, Table } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import {
    Pagination,
    QueryParamsForm,
    TableViewBar,
  } from "#lib/components/index.js";
  import {
    PageLayout,
    distroSegment,
  } from "#lib/launchpad-components/index.js";
  import { getSeriesGroups } from "#lib/modules/distroseries/series.remote.js";
  import BinaryPackagesList from "#lib/modules/packages/BinaryPackagesList.svelte";
  import BinaryPackageSidePanel from "#lib/modules/packages/binary-package/BinaryPackageSidePanel.svelte";
  import { setPackagesContext } from "#lib/modules/packages/context.js";
  import Filters from "#lib/modules/packages/filters/Filters.svelte";
  import FiltersSummary from "#lib/modules/packages/filters/FiltersSummary.svelte";
  import { getSourcePackages } from "#lib/modules/packages/packages.remote.js";
  import {
    PACKAGES_TABLE_COLUMNS,
    PAGE_SIZE_OPTIONS,
    QueryParams,
    toPackagesFilters,
  } from "#lib/modules/packages/superhref.js";
  import ManageViewsSidePanel from "#lib/modules/packages/table-views/ManageViewsSidePanel.svelte";
  import { resolveTableView } from "#lib/modules/packages/table-views/resolveTableView.js";
  import { getTableViews } from "#lib/modules/packages/table-views/table-views.remote.js";
  import type { PageProps } from "./$types.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const { params }: PageProps = $props();

  const distro = $derived(params.pillar);
  const queryParams = $derived(QueryParams.bind(new URL(page.url.href)));

  setPackagesContext({
    get distro() {
      return distro;
    },
    get queryParams() {
      return queryParams;
    },
  });

  const seriesGroupsPromise = $derived(
    getSeriesGroups({ pillar: params.pillar }),
  );
  const urlFilters = $derived(toPackagesFilters(queryParams));
  const storedTableViews = $derived(await getTableViews(distro));
  // Views saved by a navigation take precedence, so they're applied together with its URL
  const tableViews = $derived(page.state.tableViews ?? storedTableViews);
  const {
    view: currentTableView,
    filters,
    isDefaultView,
  } = $derived(resolveTableView(queryParams.view, tableViews, urlFilters));

  const sourcePackages = $derived(
    await getSourcePackages({
      distro,
      ...filters,
      sortKey: queryParams.sort.key,
      sortOrder: queryParams.sort.direction,
      page: queryParams.page,
      size: queryParams["page-size"],
    }),
  );
</script>

<svelte:head>
  <title>{distro} packages — Launchpad</title>
</svelte:head>

<!-- TODO(@Enzo): Mobile layout -->
<PageLayout
  breadcrumbsSegments={[distroSegment(distro), { label: "Packages" }]}
>
  <div class="packages">
    <h1>Packages</h1>
    <TableViewBar
      current={currentTableView.slug}
      items={tableViews.map(({ name, slug }) => ({
        text: name,
        href: queryParams.setView(slug),
        key: slug,
      }))}
      label="Packages table views"
      >{#snippet trailing()}
        <Button
          aria-label="Manage package table views"
          href={queryParams.set("panel", "manage-views")}
          importance="tertiary"
        >
          {#snippet iconLeft()}
            <SettingsIcon />
          {/snippet}
        </Button>
      {/snippet}
    </TableViewBar>
    {#if isDefaultView}
      <Filters seriesGroups={await seriesGroupsPromise} />
    {:else}
      <FiltersSummary tableView={currentTableView} />
    {/if}
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
                    data-sveltekit-reset={false}
                  />
                {/if}
              {/snippet}
            </Table.TH>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each sourcePackages.sources as item (item.id)}
          <tr>
            <th scope="row">
              <Link
                href={resolve("/[pillar]/+source/[name]", {
                  pillar: distro,
                  name: item.source_package_name,
                })}
                soft
              >
                {item.source_package_name}
              </Link>
              - {item.source_package_version}
            </th>
            <td>{item.series}</td>
            <td>{item.pocket}</td>
            <td>
              <BinaryPackagesList
                binaries={item.binaries}
                total={item.binaries_total}
                href={(id) => queryParams.set("binary-package", String(id))}
              />
            </td>
            <td>{item.status}</td>
          </tr>
        {/each}
      </tbody>
    </Table>
    <Pagination class="pagination">
      {#snippet leftGroup()}
        <QueryParamsForm
          schema={QueryParams}
          url={page.url}
          replaceParams={["page-size", "page"]}
          class="pagination-form"
          data-sveltekit-reset={false}
        >
          <Pagination.ItemsPerPageSelect
            name="page-size"
            value={queryParams["page-size"]}
            onchange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            {#each PAGE_SIZE_OPTIONS as size (size)}
              <option value={size}>{size}</option>
            {/each}
            {#if !PAGE_SIZE_OPTIONS.some((size) => size === queryParams["page-size"])}
              <option value={queryParams["page-size"]}>
                {queryParams["page-size"]}
              </option>
            {/if}
          </Pagination.ItemsPerPageSelect>
          <noscript>
            <Button type="submit" importance="tertiary">Apply</Button>
          </noscript>
        </QueryParamsForm>
        <Pagination.ItemsCount
          showing={sourcePackages.sources.length}
          total={sourcePackages.total}
        />
      {/snippet}
      {#snippet rightGroup()}
        <QueryParamsForm
          schema={QueryParams}
          url={page.url}
          replaceParams={["page"]}
          class="pagination-form"
          data-sveltekit-reset={false}
        >
          <Pagination.PageInput
            name="page"
            value={queryParams.page}
            totalPages={Math.max(1, sourcePackages.total_pages)}
          />
          <noscript>
            <Button type="submit" importance="tertiary">Go</Button>
          </noscript>
        </QueryParamsForm>
      {/snippet}
      <Pagination.PageNavigation
        direction="first"
        href={queryParams.set("page", 1)}
        disabled={queryParams.page === 1}
        data-sveltekit-reset={false}
      />
      <Pagination.PageNavigation
        direction="previous"
        href={queryParams.set("page", queryParams.page - 1)}
        disabled={queryParams.page === 1}
        data-sveltekit-reset={false}
      />
      <Pagination.PageNavigation
        direction="next"
        href={queryParams.set("page", queryParams.page + 1)}
        disabled={sourcePackages.page >= sourcePackages.total_pages}
        data-sveltekit-reset={false}
      />
      <Pagination.PageNavigation
        direction="last"
        href={queryParams.set("page", Math.max(1, sourcePackages.total_pages))}
        disabled={queryParams.page >= sourcePackages.total_pages}
        data-sveltekit-reset={false}
      />
    </Pagination>
  </div>
</PageLayout>

<BinaryPackageSidePanel {distro} binaryId={queryParams["binary-package"]} />
<ManageViewsSidePanel
  open={queryParams.panel === "manage-views"}
  seriesGroups={await seriesGroupsPromise}
/>

<style>
  .packages {
    h1 {
      margin-block-end: var(--lp-dimension-spacing-block-m);
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

    :global(.pagination-form) {
      display: contents;
    }
  }
</style>
