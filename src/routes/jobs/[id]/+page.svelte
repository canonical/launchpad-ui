<script lang="ts">
  import {
    Breadcrumbs,
    Chip,
    DateTime,
    DescriptionList,
    Log,
    Spinner,
    UserChip,
  } from "$lib/components/index.js";
  import type { DateTimeProps } from "$lib/components/index.js";
  import { JobStatus } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();
</script>

<div class="page">
  <div class="breadcrumbs">
    <Breadcrumbs
      segments={[
        { label: "Build farm", href: resolve("/jobs") },
        { label: data.job.id.toString() },
      ]}
    />
  </div>
  <div class="details">
    <div class="content-wrapper">
      <div>
        <h1>Job {data.job.title}</h1>
        <p>{data.job.description}</p>
        {#if data.job.status}
          <!-- TODO: Job status chips -->
          <JobStatus status={data.job.status} />
        {/if}
        <Chip
          value={data.job.private ? "Private" : "Public"}
          severity="information"
          readonly
        />
      </div>
      <section>
        <h2 class="visually-hidden">Details</h2>
        <DescriptionList>
          <DescriptionList.Item name="ID">
            {data.job.id}
          </DescriptionList.Item>
          <DescriptionList.Item name="Architecture">
            {data.job.architecture}
          </DescriptionList.Item>
          <DescriptionList.Item name="Requested by">
            {#if data.job.requested_by}
              <UserChip userName={data.job.requested_by} />
            {/if}
          </DescriptionList.Item>
          <DescriptionList.Item name="Created at">
            {@render nullableDateTime(data.job.created_at)}
          </DescriptionList.Item>
          <DescriptionList.Item name="Updated at">
            {@render nullableDateTime(data.job.updated_at)}
          </DescriptionList.Item>
          <DescriptionList.Item name="Started at">
            {@render nullableDateTime(data.job.started_at)}
          </DescriptionList.Item>
          {#if data.job.completed_at}
            <DescriptionList.Item name="Completed at">
              {@render nullableDateTime(data.job.completed_at)}
            </DescriptionList.Item>
          {/if}
        </DescriptionList>
      </section>
      <section>
        <h2>Commands</h2>
        <!-- TODO: Commands component -->
        <ol>
          {#each data.job.commands as command (command)}
            <li>{command}</li>
          {/each}
        </ol>
      </section>
      <section>
        <h2>Artifacts</h2>
        <!-- TODO: Artifacts component -->
        <ul>
          {#each data.job.artifact_urls as artifact (artifact)}
            <li style="word-break: break-word;">
              {artifact}
            </li>
          {/each}
        </ul>
      </section>
    </div>
  </div>
  <section class="log-container">
    <h2 class="visually-hidden">Log</h2>
    <!--
      TODO: No logs component 
      TODO: Log header component
    -->
    <div class="log-header">Log header</div>
    <div class="log-contents">
      <Log style="flex-grow: 1;">
        {#each { length: 200 }, i (i)}
          <Log.Line
            line={i + 1}
            timestamp={1765961090624 + i * 1000}
            level="info">{`Bla bla`.repeat(i + 1)}</Log.Line
          >
        {/each}
      </Log>
      <div class="trailing-bar">
        <!-- TODO: Trailing bar content -->
        <Spinner /> Tailing for 42 minutes...
      </div>
    </div>
  </section>
</div>

{#snippet nullableDateTime(date: DateTimeProps["date"] | null | undefined)}
  {#if date}
    <DateTime {date} absolute />
  {/if}
{/snippet}

<style>
  .page {
    display: grid;
    min-height: 100%;
    grid-template-rows: auto 1fr;
    grid-template-columns: minmax(300px, 1fr) 2fr;

    --border-section-separator: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-low-contrast);
  }

  .breadcrumbs {
    grid-column: 1;
    border-block-end: var(--border-section-separator);
  }

  .details {
    grid-column: 1;

    .content-wrapper {
      position: sticky;
      top: 0;
      padding-block: var(--tmp-dimension-spacing-block-l);
      padding-inline: var(--tmp-dimension-spacing-inline-l);
    }

    h1 {
      font: var(--tmp-typography-h3);
    }

    h2 {
      font: var(--tmp-typography-h5);
    }

    section + section {
      margin-block-start: var(--tmp-dimension-spacing-block-m);
      padding-block-start: var(--tmp-dimension-spacing-block-m);
      border-block-start: var(--border-section-separator);
    }

    ol,
    ul {
      list-style-position: inside;
    }
  }

  .log-container {
    grid-column: 2;
    grid-row: 1 / -1;
    display: grid;
    grid-template-rows: subgrid;

    border-inline-start: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);

    .log-header {
      position: sticky;
      top: 0;
      background-color: var(--tmp-color-background-default);
      padding: var(--tmp-dimension-spacing-block-xs)
        var(--tmp-dimension-spacing-inline-l);
    }

    .log-contents {
      display: flex;
      flex-direction: column;
    }

    .trailing-bar {
      position: sticky;
      bottom: 0;
      display: flex;
      align-items: center;
      gap: var(--tmp-dimension-spacing-inline-xxs);
      padding: var(--tmp-dimension-spacing-block-xs)
        var(--tmp-dimension-spacing-inline-m);
      background-color: var(--tmp-color-background-default);
    }
  }

  @media (max-width: 620px) {
    .page {
      grid-template-columns: auto;
    }

    .log-container {
      grid-column: 1;
      grid-row: auto;
      border-inline-start: none;
      border-block-start: var(--border-section-separator);

      display: block;
    }
  }
</style>
