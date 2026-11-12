<script lang="ts">
  import {
    Button,
    Link,
    Spinner,
    Table,
  } from "@canonical/svelte-ds-app-launchpad";
  import {
    DownloadIcon,
    ErrorIcon,
    SettingsIcon,
    SuccessIcon,
  } from "@canonical/svelte-icons";
  import {
    Pagination,
    QueryParamsForm,
    TableViewBar,
  } from "#lib/components/index.js";
  import { DEFAULT_PAGE_SIZE } from "#lib/schemas/index.js";
  import ImageStatusSummary from "./ImageStatusSummary.svelte";
  import { IMAGES_TABLE_COLUMNS, NOT_DEFINED } from "./constants.js";
  import { setImagesContext } from "./context.js";
  import Filters from "./filters/Filters.svelte";
  import FiltersSummary from "./filters/FiltersSummary.svelte";
  import { getSeriesImageCounts, getSeriesImages } from "./images.remote.js";
  import {
    MANAGE_VIEWS_PANEL,
    PANEL_QUERY_PARAM,
    QueryParams,
    toImagesFilters,
  } from "./superhref.js";
  import ManageViewsSidePanel from "./table-views/ManageViewsSidePanel.svelte";
  import { resolveTableView } from "./table-views/resolveTableView.js";
  import { getTableViews } from "./table-views/table-views.remote";
  import type { BuildStatus, TestStatus } from "./types.js";
  import { page } from "$app/state";

  let { pillar, series }: { pillar: string; series: string } = $props();

  const distro = $derived(pillar);

  setImagesContext({
    get distro() {
      return distro;
    },
    get queryParams() {
      return queryParams;
    },
  });

  const queryParams = $derived(QueryParams.bind(new URL(page.url.href)));

  const storedTableViews = $derived(await getTableViews(distro));
  const tableViews = $derived(page.state.imageTableViews ?? storedTableViews);

  const counts = $derived(
    await getSeriesImageCounts({
      distro,
      series,
      product: null,
      buildStatus: null,
      testStatus: null,
    }),
  );

  const urlFilters = $derived(toImagesFilters(queryParams));
  const {
    view: currentTableView,
    filters,
    isDefaultView,
  } = $derived(
    resolveTableView(queryParams.images.view, tableViews, urlFilters),
  );

  const imagePage = $derived(
    await getSeriesImages({
      distro,
      series,
      page: queryParams.images.page,
      ...filters,
      sortKey: queryParams.images.sort.key,
      sortOrder: queryParams.images.sort.direction,
      size: DEFAULT_PAGE_SIZE,
    }),
  );

  const totalPages = $derived(
    imagePage?.total === undefined
      ? undefined
      : Math.max(1, Math.ceil(imagePage.total / imagePage.size)),
  );
</script>

{#snippet stylizedStatus(
  status: BuildStatus | TestStatus | null | typeof NOT_DEFINED,
)}
  {#if status}
    <span class="image-status">
      {#if status === "running"}
        <Spinner />
      {:else if status === "failed"}
        <ErrorIcon class="status-icon failed" aria-hidden="true" />
      {:else if status === "successful" || status === "passed"}
        <SuccessIcon class="status-icon successful" aria-hidden="true" />
      {/if}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  {:else}
    -
  {/if}
{/snippet}

{#if counts !== null && imagePage !== null}
  <section class="series-images" aria-labelledby="images-heading">
    <h2 id="images-heading">Ubuntu images</h2>

    <div class="image-counts">
      <ImageStatusSummary
        heading="Building"
        noun="builds"
        total={counts.total}
        completedLabel="Successful"
        completedCount={counts.building.successful}
        failed={counts.building.failed}
        running={counts.building.running}
      />
      <ImageStatusSummary
        heading="Testing"
        noun="tests"
        total={counts.total}
        completedLabel="Passed"
        completedCount={counts.testing.passed}
        failed={counts.testing.failed}
        running={counts.testing.running}
      />
    </div>

    <div class="image-details">
      <TableViewBar
        current={queryParams.images.view}
        items={tableViews.map(({ name, slug }) => ({
          text: name,
          href: queryParams.setView(slug),
          key: slug,
        }))}
        label="Images table views"
        >{#snippet trailing()}
          <Button
            aria-label="Manage package table views"
            href={queryParams.set(PANEL_QUERY_PARAM, MANAGE_VIEWS_PANEL)}
            importance="tertiary"
          >
            {#snippet iconLeft()}
              <SettingsIcon />
            {/snippet}
          </Button>
        {/snippet}
      </TableViewBar>
      {#if isDefaultView}
        <Filters />
      {:else}
        <FiltersSummary tableView={currentTableView} />
      {/if}
      <div class="image-table-wrapper">
        <Table aria-label="Ubuntu images" class="image-table">
          <thead>
            <tr>
              {#each IMAGES_TABLE_COLUMNS as column (column.key)}
                <Table.TH
                  scope="col"
                  class={column.key}
                  aria-sort={column.sortable
                    ? queryParams.images.sort.key === column.key
                      ? queryParams.images.sort.direction
                      : "none"
                    : undefined}
                >
                  {column.label}
                  {#snippet action()}
                    {#if column.sortable}
                      {const next = $derived(
                        queryParams.images.sort.cycle(column.key),
                      )}
                      <Table.TH.SortButton
                        href={queryParams.images.patch({ sort: next, page: 1 })}
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
          <!-- TODO: Remove <not defined> placeholders and build UI for the missing
          fields once https://warthogs.atlassian.net/browse/LP-5179 resolves -->
          <tbody>
            {#each imagePage.items as image (image.id)}
              <tr>
                <th scope="row">{image.name}</th>
                <td>{@render stylizedStatus(image.buildStatus)}</td>
                <td>{@render stylizedStatus(image.testStatus)}</td>
                <td>&lt;not defined&gt;</td>
                <td>{image.version}</td>
                <td>
                  <Link soft href={image.url} class="image-download-link">
                    <DownloadIcon /> &lt;not defined&gt;</Link
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </div>

      <Pagination class="images-pagination" tableId="ubuntu-images">
        {#snippet leftGroup()}
          <Pagination.ItemsCount
            showing={imagePage.items.length}
            total={imagePage.total}
          />
        {/snippet}
        {#snippet rightGroup()}
          <QueryParamsForm
            schema={QueryParams}
            url={page.url}
            replaceParams={["images.page"]}
            class="pagination-form"
            data-sveltekit-keepfocus
          >
            <Pagination.PageInput
              name="images.page"
              value={queryParams.images.page}
              {totalPages}
            />
            <noscript>
              <Button type="submit" importance="tertiary">Go</Button>
            </noscript>
          </QueryParamsForm>
        {/snippet}
        <Pagination.PageNavigation
          direction="first"
          href={queryParams.images.set("page", 1)}
          disabled={queryParams.images.page === 1}
          data-sveltekit-keepfocus
        />
        <Pagination.PageNavigation
          direction="previous"
          href={queryParams.images.set(
            "page",
            Math.max(1, queryParams.images.page - 1),
          )}
          disabled={queryParams.images.page === 1}
          data-sveltekit-keepfocus
        />
        {#if totalPages !== undefined}
          <Pagination.PageNavigation
            direction="next"
            href={queryParams.images.set(
              "page",
              Math.min(totalPages, queryParams.images.page + 1),
            )}
            disabled={queryParams.images.page >= totalPages}
            data-sveltekit-keepfocus
          />
          <Pagination.PageNavigation
            direction="last"
            href={queryParams.images.set("page", totalPages)}
            disabled={queryParams.images.page >= totalPages}
            data-sveltekit-keepfocus
          />
        {/if}
      </Pagination>
    </div>
  </section>

  <ManageViewsSidePanel
    open={queryParams[PANEL_QUERY_PARAM] === MANAGE_VIEWS_PANEL}
  />
{/if}

<style>
  .image-status {
    display: inline-flex;
    align-items: center;
    gap: var(--space-100);
  }

  :global(.status-icon) {
    &.successful {
      color: var(--color-icon-success);
    }

    &.failed {
      color: var(--color-icon-error);
    }
  }

  .series-images {
    display: contents;

    h2 {
      grid-column: 1 / -1;
      margin-block-end: var(--space-200);
    }

    .image-table-wrapper {
      overflow-x: auto;
    }

    :global(.image-download-link) {
      display: flex;
      align-items: center;
      gap: var(--space-050);
    }

    :global(.image-table) {
      width: 100%;
      min-width: 48rem; /* This is needed to make the table fixed size on small screens such that is overflows instead of shrinking */
      table-layout: fixed;

      :global {
        td,
        th {
          vertical-align: top;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        thead th {
          &.image-name {
            width: 25%;
          }
          &.build-status {
            width: 15%;
          }
          &.test-status {
            width: 15%;
          }
          &.bugs {
            width: 15%;
          }
          &.version {
            width: 15%;
          }
          &.download {
            width: 15%;
          }
        }
      }

      tbody {
        th {
          font-weight: var(--typography-text-primary-font-weight);
        }
      }
    }
  }

  .image-counts {
    margin-block-start: var(--space-100);
    grid-column: 1 / -1;
  }

  .image-details {
    grid-column: 1/-1;
  }

  :global(.images-pagination) {
    position: sticky;
    bottom: 0;
  }

  :global(.pagination-form) {
    display: contents;
  }

  @media (min-width: 768px) {
    :global(.image-table) {
      min-width: auto;
    }

    .image-counts {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      column-gap: var(--dimension-300);
    }
  }

  @media (min-width: 1280px) {
    .image-counts {
      display: block;
      grid-column: span 4;
    }

    .image-details {
      grid-column: span 12;
    }
  }
</style>
