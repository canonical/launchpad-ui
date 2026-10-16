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
  } from "$lib/components/index.js";
  import {
    getSeriesImageCounts,
    getSeriesImages,
  } from "$lib/modules/distroseries/images/images.remote.js";
  import ImageStatusSummary from "./ImageStatusSummary.svelte";
  import { DEFAULT_TABLE_VIEWS, IMAGES_TABLE_COLUMNS } from "./constants.js";
  import { setImagesContext } from "./context.js";
  import Filters from "./filters/Filters.svelte";
  import { QueryParams } from "./superhref.js";
  import type { BuildStatus, TestStatus } from "./types.js";
  import { page } from "$app/state";

  let { pillar, series }: { pillar: string; series: string } = $props();

  setImagesContext({
    get queryParams() {
      return queryParams;
    },
  });

  const queryParams = $derived(QueryParams.bind(page.url));

  const imagePage = $derived(
    await getSeriesImages({
      pillar,
      series,
      page: queryParams.page,
      product: queryParams.product,
      buildStatus: queryParams["build-status"],
      testStatus: queryParams["test-status"],
      sortKey: queryParams.sort.key,
      sortOrder: queryParams.sort.direction,
    }),
  );
  const counts = $derived(await getSeriesImageCounts({ pillar, series }));

  function formatFileSize(bytes: number): string {
    return `${(bytes / 1_000_000_000).toFixed(1)} GiB`;
  }
</script>

{#snippet stylizedStatus(status: BuildStatus | TestStatus | null)}
  {#if status}
    <span class="image-status">
      {#if status === "running"}
        <Spinner />
      {:else if status === "failed"}
        <ErrorIcon class="status-icon failed" aria-hidden="true" />
      {:else}
        <SuccessIcon class="status-icon successful" aria-hidden="true" />
      {/if}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  {:else}
    -
  {/if}
{/snippet}

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
      current={queryParams.view}
      items={DEFAULT_TABLE_VIEWS.map(({ name, slug }) => ({
        text: name,
        href: queryParams.setView(slug),
        key: slug,
      }))}
      label="Images table views"
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
    <Filters />
    <div class="image-table-wrapper">
      <Table aria-label="Ubuntu images" class="image-table">
        <thead>
          <tr>
            {#each IMAGES_TABLE_COLUMNS as column (column.key)}
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
          {#each imagePage.items as image (image.id)}
            <tr>
              <th scope="row">{image.name}</th>
              <td>{@render stylizedStatus(image.buildStatus)}</td>
              <td>{@render stylizedStatus(image.testStatus)}</td>
              <td> - </td>
              <td>{image.version}</td>
              <td>
                <Link soft href={image.url} class="image-download-link">
                  <DownloadIcon /> {formatFileSize(image.fileSize)}</Link
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
          replaceParams={["page"]}
          class="pagination-form"
          data-sveltekit-keepfocus
        >
          <Pagination.PageInput
            name="page"
            value={queryParams.page}
            totalPages={imagePage.totalPages}
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
        data-sveltekit-keepfocus
      />
      <Pagination.PageNavigation
        direction="previous"
        href={queryParams.set("page", Math.max(1, queryParams.page - 1))}
        disabled={queryParams.page === 1}
        data-sveltekit-keepfocus
      />
      <Pagination.PageNavigation
        direction="next"
        href={queryParams.set(
          "page",
          Math.min(imagePage.totalPages, queryParams.page + 1),
        )}
        disabled={queryParams.page >= imagePage.totalPages}
        data-sveltekit-keepfocus
      />
      <Pagination.PageNavigation
        direction="last"
        href={queryParams.set("page", imagePage.totalPages)}
        disabled={queryParams.page >= imagePage.totalPages}
        data-sveltekit-keepfocus
      />
    </Pagination>
  </div>
</section>

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
