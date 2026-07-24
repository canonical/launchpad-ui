<script lang="ts">
  import {
    Breadcrumbs,
    Button,
    Link,
    SearchBox,
    Select,
    Table,
  } from "@canonical/svelte-ds-app-launchpad";
  import { Pagination, TabList } from "$lib/components/index.js";
  import BinaryPackageSidePanel from "$lib/modules/packages/BinaryPackageSidePanel/BinaryPackageSidePanel.svelte";
  import { setPackagesContext } from "$lib/modules/packages/context.js";
  import { QueryParams } from "$lib/modules/packages/superhref.js";
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
  <div class="page-header">
    <h1>Packages</h1>
    <Button disabled>Manage views</Button>
  </div>
  <!-- TODO: Make TabList accent/border span 100% of the parent -->
  <TabList>
    <TabList.Tab active>All packages</TabList.Tab>
    <TabList.Tab>My uploads</TabList.Tab>
    <TabList.Tab>Latest uploads</TabList.Tab>
    <TabList.Tab>Ubuntu server</TabList.Tab>
  </TabList>

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
        <th scope="col" class="source-package">Source package</th>
        <th scope="col" class="status">Status</th>
        <th scope="col" class="series">Series</th>
        <th scope="col" class="pocket">Pocket</th>
        <th scope="col" class="binary-packages">Binary packages</th>
      </tr>
    </thead>
    <tbody>
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
          <td>{item.series.displayName}</td>
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
      <Pagination.ItemsCount showing={data.size} total={data.total} />
    {/snippet}
    {#snippet rightGroup()}
      <Pagination.PageInput
        value={data.page}
        totalPages={Math.ceil(data.total / data.size)}
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

<style>
  main {
    padding: var(--lp-dimension-spacing-block-m)
      var(--lp-dimension-spacing-inline-l);

    :global(.breadcrumbs) {
      padding: 0;
      margin-block-end: var(--lp-dimension-spacing-block-xs);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block-end: var(--lp-dimension-spacing-block-xs);
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
        &.status {
          width: 10%;
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
