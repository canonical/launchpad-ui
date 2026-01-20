<script lang="ts">
  import { DownloadIcon, FileIcon } from "@canonical/svelte-icons";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    Breadcrumbs,
    Chip,
    DateTime,
    DescriptionList,
    Link,
    Log,
    Spinner,
    Switch,
    UserChip,
  } from "$lib/components/index.js";
  import type { DateTimeProps } from "$lib/components/index.js";
  import {
    CommandList,
    JobStatusIcon,
  } from "$lib/launchpad-components/index.js";
  import { bytesToHumanReadable } from "$lib/utils/index.js";
  import type { PageProps } from "./$types";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();

  const job = $derived(data.job);
  const log = $derived(data.log);

  let wrapLogs = $state(true);
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
              <JobStatusIcon status={job.status} aria-hidden="true" />
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
    {#if job.artifacts?.length}
      <section>
        <div
          class="section-header"
          style="display: flex; justify-content: space-between; align-items: center;"
        >
          <h2>Artifacts</h2>
          <!--
          TODO:
            - Add href, when zip endpoint is available
            - Replace with a proper Button component
          -->
          <ButtonPrimitive
            as="a"
            disabled
            style="display: flex; gap: var(--tmp-dimension-spacing-inline-xs); align-items: center; padding: var(--tmp-dimension-spacing-block-minimum) var(--tmp-dimension-spacing-inline-xs);"
          >
            <DownloadIcon />Download All
          </ButtonPrimitive>
        </div>
        <ul class="artifacts">
          {#each job.artifacts as { url, size } (url)}
            <li>
              <Link href={url} download>
                <span class="icon-aligner">
                  <FileIcon aria-hidden="true" />
                </span>
                <span class="artifact-name">
                  {url.split("/").at(-1)} ({bytesToHumanReadable(size)})
                </span>
              </Link>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
  <section class="log-container">
    <h2 class="visually-hidden">Log</h2>
    <!--
      TODO: Log header component
    -->
    {#if log.length > 0}
      <div class="log-header" style="display: flex; align-items: center;">
        <label style="display: flex; align-items: center; gap: 4px;">
          <Switch bind:checked={wrapLogs} /> Wrap lines
        </label>
      </div>
      <div class="log-contents">
        <!-- FIXME(@Enzo): Without timestamp auto-hiding and with wrapLines, the layout degenerates on medium viewports -->
        <Log style="flex-grow: 1;" wrapLines={wrapLogs}>
          {#each log as { timestamp, message }, i (i)}
            <Log.Line line={i + 1} {timestamp}>{message}</Log.Line>
          {/each}
        </Log>
        <!-- TODO: Trailing bar content -->
        <div class="trailing-bar">
          <Spinner /> Tailing for 42 minutes...
        </div>
      </div>
    {:else}
      <div class="no-logs">
        <!-- TODO: Can there be a case where the log is empty but the build has started? -->
        <p class="message">
          The log stream will appear here once the build starts.
        </p>
        <img
          src="/brand-icons/screen-with-code.svg"
          alt="A screen with code"
          aria-hidden="true"
        />
      </div>
    {/if}
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
      "details log-container" minmax(0, 1fr) / minmax(300px, 3fr) 5fr;

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

    .artifacts {
      list-style: none;
      display: grid;
      gap: var(--tmp-dimension-spacing-block-xs);

      :global(a) {
        display: flex;
        align-items: start;
        gap: var(--tmp-dimension-spacing-inline-xs);
        color: var(--tmp-color-text-default);

        > .icon-aligner {
          height: 1lh;
          flex-shrink: 0;
          display: grid;
          place-items: center;
        }

        > .artifact-name {
          word-break: break-word;
        }
      }
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

    .no-logs {
      grid-row: 1 / -1;
      padding: var(--tmp-dimension-spacing-block-l)
        var(--tmp-dimension-spacing-inline-l);
      font: var(--tmp-typography-code-s);
      background-color: var(--tmp-color-background-alt);

      .message {
        margin-block-end: var(--tmp-dimension-spacing-block-xs);
      }
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
      min-height: 100vh;
      grid-template:
        "breadcrumbs" auto
        "details" auto
        "log-container" 1fr / 1fr;
    }

    .log-container {
      display: flex;
      flex-direction: column;

      border-inline-start: none;
      border-block-start: var(--border-section-separator);

      .log-header {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .log-contents {
        flex-grow: 1;
      }

      .trailing-bar {
        position: sticky;
        bottom: 0;
      }
    }
  }
</style>
