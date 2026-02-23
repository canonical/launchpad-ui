<script lang="ts">
  import type { JobRead } from "$lib/api/job-manager/types.js";
  import { Link, Table, UserChip } from "$lib/components/index.js";
  import { DateTime, JobStatusIcon } from "$lib/launchpad-components/index.js";
  import { resolve } from "$app/paths";
  import { navigating, page } from "$app/state";

  const {
    jobs,
    tableId,
  }: {
    jobs: JobRead[];
    tableId: string;
  } = $props();

  const sort = $derived.by(() => {
    const sort = page.url.searchParams.get("sort");

    if (!sort) {
      return null;
    }

    if (sort.startsWith("-")) {
      return {
        field: sort.slice(1),
        direction: "descending" as const,
      };
    }

    return { field: sort, direction: "ascending" as const };
  });

  const sortLinkLabel = (key: keyof JobRead, column: string) => {
    if (!sort || sort.field !== key) {
      return `Sort by ${column} ascending`;
    } else if (sort.direction === "ascending") {
      return `Sort by ${column} descending`;
    } else {
      return `Remove sorting by ${column}`;
    }
  };

  const sortLinkHref = (key: keyof JobRead) => {
    const url = new URL(page.url);
    let sortParam: string;

    if (!sort || sort.field !== key) {
      sortParam = `${key}`;
    } else if (sort.direction === "ascending") {
      sortParam = `-${key}`;
    } else {
      url.searchParams.delete("sort");
      return url.pathname + url.search;
    }

    url.searchParams.set("sort", sortParam);
    url.searchParams.delete("page"); // Reset to first page when sorting changes

    return url.pathname + url.search;
  };

  const headerCells = [
    { key: "id", label: "ID", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "architecture", label: "Architecture", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "requested_by", label: "Requested by", sortable: true },
    { key: "tags", label: "Tags", sortable: false },
    { key: "created_at", label: "Created", sortable: true },
    { key: "started_at", label: "Started", sortable: true },
    { key: "completed_at", label: "Finished", sortable: true },
    { key: "private", label: "Access", sortable: true },
  ] satisfies { key: keyof JobRead; label: string; sortable: boolean }[];

  const isTableChanging = $derived(
    navigating.to &&
      navigating.from &&
      navigating.to.route.id === navigating.from.route.id,
  );
</script>

<Table id={tableId} aria-busy={isTableChanging} class="jobs-table">
  <thead>
    <tr>
      {#each headerCells as { key, label, sortable } (key)}
        {#if sortable}
          <Table.TH
            sortDirection={$state.eager(
              sort?.field === key ? sort.direction : undefined,
            )}
          >
            {label}
            {#snippet action()}
              <Table.TH.SortButton
                aria-label={$state.eager(sortLinkLabel(key, label))}
                href={$state.eager(sortLinkHref(key))}
                data-sveltekit-replacestate
                data-sveltekit-noscroll
              />
            {/snippet}
          </Table.TH>
        {:else}
          <th scope="col">{label}</th>
        {/if}
      {/each}
    </tr>
  </thead>
  <tbody style:opacity={isTableChanging ? 0.5 : 1}>
    {#each jobs as job (job.id)}
      <tr>
        <td>
          <Link href={resolve("/jobs/[id]", { id: job.id.toString() })}>
            {job.id}
          </Link>
        </td>
        <td>{job.title || "-"}</td>
        <td>{job.architecture}</td>
        <td>
          <div
            style="display: flex; align-items: center; gap: var(--lp-dimension-spacing-inline-s)"
          >
            <JobStatusIcon status={job.status} aria-hidden="true" />
            <span>
              {job.status ?? "UNKNOWN"}
            </span>
          </div>
        </td>
        <td>
          <UserChip userName={job.requested_by} size="small" />
        </td>
        <td>
          {#if job.tags.length > 0}
            {job.tags.join(", ")}
          {:else}
            -
          {/if}
        </td>
        <td>
          <DateTime date={job.created_at} />
        </td>
        <td>
          {#if job.started_at}
            <DateTime date={job.started_at} />
          {:else}
            -
          {/if}
        </td>
        <td>
          {#if job.completed_at}
            <DateTime date={job.completed_at} />
          {:else}
            -
          {/if}
        </td>
        <td>{job.private ? "Private" : "Public"}</td>
      </tr>
    {/each}
  </tbody>
</Table>

<style>
  :global {
    .jobs-table {
      isolation: isolate;
      display: grid;
      --jobs-table-column-max-width: 320px;
      --jobs-table-column-min-width: 80px;

      /* 
        Columns don't get smaller than `max-content`,
        but if there is leftover space, don't let them stretch beyond `--jobs-table-column-max-width`
        + distribute any leftover space proportionally based on their content size (max in `px` not with `fr`)
      */
      grid-template-columns: repeat(
        10,
        minmax(max-content, var(--jobs-table-column-max-width))
      );

      th,
      td {
        /* Hard lower limit for column width */
        min-width: var(--jobs-table-column-min-width);
        /* 
          If `min > max` in `minmax(min, max)`, then `max` is ignored and the track size is `min`.
          So we need to set a hard `max-width` on the cells
         */
        max-width: var(--jobs-table-column-max-width);
      }
    }
  }

  thead,
  tbody,
  tr {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }

  thead {
    background-color: var(--lp-color-background-default);
    z-index: 1;
    position: sticky;
    top: 0;
  }
</style>
