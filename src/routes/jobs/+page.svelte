<script lang="ts">
  import { DateTime, Link, Spinner, UserChip } from "$lib/components/index.js";
  import type { DateTimeProps } from "$lib/components/index.js";
  import { JobStatusIcon, Whoops } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();

  const jobsPromise = $derived(data.jobsPromise);
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
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Architecture</th>
        <th>Status</th>
        <th>Requested by</th>
        <th>Tags</th>
        <th>Created</th>
        <th>Started</th>
        <th>Finished</th>
        <th>Access</th>
      </tr>
    </thead>
    <tbody>
      {#each await jobsPromise as job (job.id)}
        <tr>
          <td>
            <Link href={resolve("/jobs/[id]", { id: job.id.toString() })}>
              {job.id}
            </Link>
          </td>
          <td>{job.title || "-"}</td>
          <td>{job.architecture}</td>
          <td
            style="display: flex; align-items: center; gap: var(--tmp-dimension-spacing-inline-s)"
          >
            <JobStatusIcon status={job.status} aria-hidden="true" />
            <span>
              {job.status ?? "UNKNOWN"}
            </span>
          </td>
          <td>
            {#if job.requested_by}
              <UserChip userName={job.requested_by} />
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
  </table>
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

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    font: var(--tmp-typography-paragraph-s-strong);
  }

  td {
    font: var(--tmp-typography-paragraph-s);
  }

  th,
  td {
    padding: var(--tmp-dimension-spacing-block-xs, 8px)
      var(--spacing-horizontal-small, 8px);
    color: var(--tmp-color-text-default);
  }

  tbody tr {
    border-top: 1px solid var(--tmp-color-border-low-contrast);
  }
</style>
