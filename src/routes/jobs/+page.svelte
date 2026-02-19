<script lang="ts">
  import type { JobRead } from "$lib/api/job-manager/types.js";
  import {
    DateTime,
    Link,
    Spinner,
    Table,
    UserChip,
  } from "$lib/components/index.js";
  import type { DateTimeProps } from "$lib/components/index.js";
  import { JobStatusIcon, Whoops } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";
  import { resolve } from "$app/paths";
  import { navigating, page } from "$app/state";

  let { data }: PageProps = $props();

  const jobsPromise = $derived(data.jobsPromise);

  const sort = $derived.by(() => {
    const sort = page.url.searchParams.get("sort");
    if (!sort) {
      return null;
    }

    if (sort.startsWith("-")) {
      return { field: sort.slice(1), direction: "descending" as const };
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
</script>

<!--
  This is quite interesting. If you just return the awaited data from a load function, you won't navigate to the page until the fetch completes. Returning a promise allows you to stream the response to the client. However, this means that you won't ever see the data if you don't have JS enabled (no way to consume the stream).
  
  The best course of action would be to await the promise on the server during SSR, but if the navigation is happening on the client, proceed to the page immediately and show a loading state while the promise resolves.
  
  If the <svelte:boundary> has a pending snippet, the inner async work won't be awaited before the render result is returned. So, if we condition the presence of the `pending` snippet on `browser`, we can provide a snippet only if the component is being rendered on the client.
    
  TODO: Is this the correct way to do that?

  NOTE: If we want to have the pending state being displayed during page/subpage navigation, the boundary has to exist in the +page.svelte file itself, as boundaries in +layout.svelte will not be recreated during navigation (see: https://svelte.dev/docs/svelte/svelte-boundary#Properties-pending).
-->
<svelte:boundary
  pending={browser ? pending : undefined}
  onerror={(e) => console.error(e)}
>
  {#snippet failed()}
    <Whoops status={500} message="Failed to load jobs" />
  {/snippet}
  <Table style="width: 100%;">
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
                  aria-label={sortLinkLabel(key, label)}
                  href={sortLinkHref(key)}
                />
              {/snippet}
            </Table.TH>
          {:else}
            <th scope="col">{label}</th>
          {/if}
        {/each}
      </tr>
    </thead>
    <!-- TODO(@Enzo): How to indicate state changing? -->
    <tbody style:opacity={navigating.complete === null ? 1 : 0.5}>
      {#each (await jobsPromise).data as job (job.id)}
        <tr>
          <td>
            <Link href={resolve("/jobs/[id]", { id: job.id.toString() })}>
              {job.id}
            </Link>
          </td>
          <td>{job.title || "-"}</td>
          <td>{job.architecture}</td>
          <td
            style="display: flex; align-items: center; gap: var(--lp-dimension-spacing-inline-s)"
          >
            <JobStatusIcon status={job.status} aria-hidden="true" />
            <span>
              {job.status ?? "UNKNOWN"}
            </span>
          </td>
          <td>
            {#if job.requested_by}
              <UserChip userName={job.requested_by} size="small" />
            {:else}
              -
            {/if}
          </td>
          <td>
            {#if job.tags.length > 0}
              {job.tags.join(", ")}
            {:else}
              -
            {/if}
          </td>
          <td>
            {@render nullableDateTime(job.created_at)}
          </td>
          <td>
            {@render nullableDateTime(job.started_at)}
          </td>
          <td>
            {@render nullableDateTime(job.completed_at)}
          </td>
          <td>{job.private ? "Private" : "Public"}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</svelte:boundary>

{#snippet nullableDateTime(date: DateTimeProps["date"] | null | undefined)}
  {#if date === null || date === undefined}
    -
  {:else}
    <DateTime {date} />
  {/if}
{/snippet}

{#snippet pending()}
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <Spinner /> loading jobs...
  </div>
{/snippet}
