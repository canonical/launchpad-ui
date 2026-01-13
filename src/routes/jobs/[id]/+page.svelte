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
  import {
    CommandList,
    JobStatusIcon,
  } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();

  const job = $derived(data.job);
</script>

<div class="page">
  <div class="breadcrumbs">
    <Breadcrumbs
      segments={[
        { label: "Build farm", href: resolve("/jobs") },
        { label: job.id.toString() },
      ]}
    />
  </div>
  <div class="details">
    <div>
      <h1>{job.title || job.id}</h1>
      <p>{job.description}</p>
      <div class="chips">
        {#if job.status}
          <Chip
            value={job.status}
            readonly
            severity={job.status === "FAILED"
              ? "negative"
              : job.status === "FINISHED"
                ? "positive"
                : "neutral"}
          >
            {#snippet icon()}
              <JobStatusIcon
                status={job.status}
                aria-hidden="true"
                --job-status-icon-color="currentColor"
              />
            {/snippet}
          </Chip>
        {/if}
        <Chip
          value={job.private ? "Private" : "Public"}
          severity="information"
          readonly
        />
      </div>
    </div>
    <section>
      <h2 class="visually-hidden">Details</h2>
      <DescriptionList>
        <DescriptionList.Item name="ID">
          {job.id}
        </DescriptionList.Item>
        <DescriptionList.Item name="Architecture">
          {job.architecture}
        </DescriptionList.Item>
        <DescriptionList.Item name="Requested by">
          {#if job.requested_by}
            <UserChip userName={job.requested_by} />
          {/if}
        </DescriptionList.Item>
        <DescriptionList.Item name="Created at">
          {@render nullableDateTime(job.created_at)}
        </DescriptionList.Item>
        <DescriptionList.Item name="Updated at">
          {@render nullableDateTime(job.updated_at)}
        </DescriptionList.Item>
        <DescriptionList.Item name="Started at">
          {@render nullableDateTime(job.started_at)}
        </DescriptionList.Item>
        <DescriptionList.Item name="Completed at">
          {@render nullableDateTime(job.completed_at)}
        </DescriptionList.Item>
      </DescriptionList>
    </section>
    <section>
      <h2 class="section-header">Commands</h2>
      <CommandList>
        {#each job.commands as command, i (i)}
          <!-- 
            TODO(job-manager):
              - pass command status
              - command not as `unknown` but proper type
              - link command to log entry
            
            TODO: Syntax highlighting for command
          -->
          <CommandList.Command
            status={null}
            command={command as string}
            href={undefined}
          />
        {/each}
      </CommandList>
    </section>
    <section>
      <h2 class="section-header">Artifacts</h2>
      <!-- TODO: Artifacts component -->
      <ul>
        {#each job.artifact_urls as artifact (artifact)}
          <li style="word-break: break-word;">
            {artifact}
          </li>
        {/each}
      </ul>
    </section>
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
    height: 100vh;

    grid-template:
      "breadcrumbs log-container" auto
      "details log-container" minmax(0, 1fr) / minmax(300px, 1fr) 2fr;

    --border-section-separator: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-low-contrast);
  }

  .breadcrumbs {
    grid-area: breadcrumbs;
    border-block-end: var(--border-section-separator);
  }

  .details {
    grid-area: details;
    overflow: auto;

    padding-block: var(--tmp-dimension-spacing-block-l);
    padding-inline: var(--tmp-dimension-spacing-inline-l);

    h1 {
      font: var(--tmp-typography-h3);
    }

    h2 {
      font: var(--tmp-typography-h5);
    }

    .chips {
      display: flex;
      gap: var(--tmp-dimension-spacing-inline-xxs);
      margin-block-start: var(--tmp-dimension-spacing-block-xs);
    }

    section:first-of-type {
      margin-block-start: var(--tmp-dimension-spacing-block-l);
    }

    section + section {
      margin-block-start: var(--tmp-dimension-spacing-block-m);
      padding-block-start: var(--tmp-dimension-spacing-block-m);
      border-block-start: var(--border-section-separator);
    }

    .section-header {
      margin-block-end: var(--tmp-dimension-spacing-block-m);
    }

    ul {
      list-style-position: inside;
    }
  }

  .log-container {
    grid-area: log-container;
    display: grid;
    grid-template-rows: subgrid;

    border-inline-start: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);

    .log-header {
      background-color: var(--tmp-color-background-default);
      padding: var(--tmp-dimension-spacing-block-xs)
        var(--tmp-dimension-spacing-inline-l);
    }

    .log-contents {
      display: flex;
      flex-direction: column;
    }

    .trailing-bar {
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
      height: auto;
      grid-template:
        "breadcrumbs" auto
        "details" auto
        "log-container" auto / 1fr;
    }

    .log-container {
      display: block;

      border-inline-start: none;
      border-block-start: var(--border-section-separator);

      .log-header {
        position: sticky;
        top: 0;
      }

      .trailing-bar {
        position: sticky;
        bottom: 0;
      }
    }
  }
</style>
