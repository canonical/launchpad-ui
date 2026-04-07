<script lang="ts">
  import { Spinner } from "@canonical/svelte-ds-app-launchpad";
  import { Whoops } from "$lib/launchpad-components/index.js";
  import QueueTable from "$lib/modules/job-manager/jobs/QueueTable.svelte";
  import {
    JobsFilters,
    JobsPagination,
    JobsTable,
    toPageNumber,
  } from "$lib/modules/job-manager/jobs/index.js";
  import type { PageProps } from "./$types.js";
  import { browser } from "$app/environment";

  let { data }: PageProps = $props();

  const tableId = $props.id();
</script>

<main>
  <div class="top-section">
    <h1>Launchpad Build farm</h1>
    <p class="description">
      The Launchpad build farm is an open-source system for building and testing
      packages.
    </p>
    <QueueTable capacities={data.capacity.architectures} class="queue-table" />
    <h2>Builds</h2>
    <JobsFilters {tableId} />
  </div>
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
    {@const { data: jobs, metadata } = await data.jobsPromise}
    <div class="jobs-table-wrapper">
      <JobsTable {jobs} {tableId} />
      {#if metadata.total_count === 0}
        <p class="jobs-table-message">No builds match your current filters.</p>
      {:else if jobs.length === 0}
        <!-- Displayed, when the user manually navigates to a page that is out of range (e.g., by modifying the URL)-->
        <p class="jobs-table-message">
          Page {toPageNumber(metadata.offset, metadata.limit)} is empty.
        </p>
      {/if}
    </div>
    <div class="jobs-pagination-wrapper">
      <JobsPagination {metadata} {tableId} numJobs={jobs.length} />
    </div>
    {#snippet failed()}
      <Whoops status={500} message="Failed to load jobs" />
    {/snippet}
  </svelte:boundary>
</main>

{#snippet pending()}
  <div
    style="display: flex; align-items: center; gap: 0.5rem; padding-inline: var(--jobs-page-padding-inline);"
  >
    <Spinner /> loading jobs...
  </div>
{/snippet}

<style>
  main {
    height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;

    --jobs-page-padding-block: var(--lp-dimension-spacing-block-l);
    --jobs-page-padding-inline: var(--lp-dimension-spacing-inline-l);
  }

  .top-section {
    padding-inline: var(--jobs-page-padding-inline);
    padding-block-start: var(--jobs-page-padding-block);

    position: sticky;
    left: 0;

    h1 {
      font: var(--lp-typography-h3);
      margin-block-end: var(--lp-dimension-spacing-block-m);
    }

    .description {
      margin-block-end: var(--lp-dimension-spacing-block-l);
      max-width: 489px;
    }

    :global(.queue-table) {
      margin-block-end: var(--lp-dimension-spacing-block-xxl);
      max-width: 831px;
    }
  }

  h2 {
    font: var(--lp-typography-h3);
  }

  .jobs-table-wrapper {
    min-width: min-content;
    padding-inline: var(--jobs-page-padding-inline);
    flex-grow: 1;
  }

  .jobs-table-message {
    font: var(--lp-typography-paragraph-s);
    color: var(--lp-color-text-muted);
    font-style: italic;
    padding-block: var(--lp-dimension-spacing-block-xs);
    padding-inline: var(--lp-dimension-spacing-inline-xs);
  }

  .jobs-pagination-wrapper {
    position: sticky;
    bottom: 0;
    left: 0;
    background-color: var(--lp-color-background-default);
    padding-inline: var(--jobs-page-padding-inline);
  }
</style>
