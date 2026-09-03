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
    DEFAULT_TABLE_VIEW,
    PACKAGES_TABLE_COLUMNS,
    QueryParams,
    TABLE_VIEWS,
  } from "$lib/modules/packages/superhref.js";
  import type { PageProps } from "./$types.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const { params, data }: PageProps = $props();

  const queryParams = $derived(QueryParams.bind(page.url));
  setPackagesContext({
    get queryParams() {
      return queryParams;
    },
  });
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
    items={TABLE_VIEWS.map(({ name, slug }) => ({
      text: name,
      href: queryParams.setView(slug),
      current: slug === queryParams.view,
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
          <option>All</option>
        </Select>
      </label>
    {/each}
  </div>

  <Table class="packages-table">
    <thead>
      <tr>
        {#each PACKAGES_TABLE_COLUMNS as { key, label } (key)}
          {@const sort = queryParams.sort}
          {@const next = sort.cycle(key)}
          <Table.TH
            scope="col"
            class={key}
            aria-sort={sort.key === key ? sort.direction : "none"}
          >
            {label}
            {#snippet action()}
              <Table.TH.SortButton
                href={queryParams.set("sort", next)}
                aria-label={next.direction === "none"
                  ? `Remove sorting by ${label}`
                  : `Sort by ${label} ${next.direction}`}
                data-sveltekit-noscroll
                data-sveltekit-keepfocus
              />
            {/snippet}
          </Table.TH>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if data.unavailable}
        <tr>
          <td
            colspan={PACKAGES_TABLE_COLUMNS.length}
            class="packages-unavailable"
          >
            Couldn't load packages. Refresh the page to try again.
          </td>
        </tr>
      {:else}
        {#each data.items as item (item.sourcePackage.id)}
          <tr>
            <th scope="row">
              <Link
                href={resolve("/[pillar]/+source/[name]", {
                  pillar: params.pillar,
                  name: item.sourcePackage.name,
                })}
                soft
              >
                {item.sourcePackage.name}
              </Link>
            </th>
            <td>{item.status}</td>
            <td>{item.pocket}</td>
            <td>
              {#each item.binaryPackages as binaryPackage (binaryPackage.name)}
                <Link
                  href={queryParams.set("binary-package", binaryPackage.name)}
                  soft
                  class="package-link"
                  data-sveltekit-noscroll
                >
                  {binaryPackage.name}
                </Link>
              {/each}
            </td>
            <td>{item.series.displayName}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </Table>
  {#if !data.unavailable}
    <Pagination class="pagination">
      {#snippet leftGroup()}
        <Pagination.ItemsPerPageSelect disabled>
          <option value={10}>10</option>
          <option value={25} selected>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Pagination.ItemsPerPageSelect>
        <Pagination.ItemsCount showing={data.size} total={data.total} />
      {/snippet}
      {#snippet rightGroup()}
        <Pagination.PageInput
          value={data.page}
          totalPages={Math.ceil(data.total / data.size) || 1}
          disabled
        />
      {/snippet}
      <Pagination.PageNavigation direction="first" disabled />
      <Pagination.PageNavigation direction="previous" disabled />
      <Pagination.PageNavigation direction="next" disabled />
      <Pagination.PageNavigation direction="last" disabled />
    </Pagination>
  {/if}
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

    .packages-unavailable {
      padding-block: var(--lp-dimension-spacing-block-m);
      color: var(--lp-color-text-muted);
      text-align: center;
    }

    :global(.pagination) {
      position: sticky;
      bottom: 0;
    }
  }
</style>
