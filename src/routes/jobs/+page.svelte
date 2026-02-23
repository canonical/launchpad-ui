<script lang="ts">
  import { Spinner } from "$lib/components/index.js";
  import { Whoops } from "$lib/launchpad-components/index.js";
  import {
    JobsPagination,
    JobsTable,
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
    <div class="queue-table">Queue table placeholder</div>
    <h2>Builds</h2>
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

    --jobs-page-padding-block: var(--lp-dimension-spacing-block-l);
    --jobs-page-padding-inline: var(--lp-dimension-spacing-inline-l);
  }

  .top-section {
    padding-inline: var(--jobs-page-padding-inline);
    padding-block-start: var(--jobs-page-padding-block);

    position: sticky;
    left: 0;
  }

  h1 {
    font: var(--lp-typography-h3);
    margin-block-end: var(--lp-dimension-spacing-block-m);
  }

  .description {
    margin-block-end: var(--lp-dimension-spacing-block-l);
    max-width: 489px;
  }

  h2 {
    font: var(--lp-typography-h3);
  }

  .queue-table {
    height: 229px;
    max-width: 831px;
    border: 1px dashed var(--lp-color-border-default);
    display: grid;
    place-items: center;
    margin-block-end: var(--lp-dimension-spacing-block-xxl);
  }

  .jobs-table-wrapper {
    min-width: min-content;
    padding-inline: var(--jobs-page-padding-inline);
  }

  .jobs-pagination-wrapper {
    position: sticky;
    bottom: 0;
    left: 0;
    background-color: var(--lp-color-background-default);
    padding-inline: var(--jobs-page-padding-inline);
    margin-block-end: var(--jobs-page-padding-block);
  }
</style>
