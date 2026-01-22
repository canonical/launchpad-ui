<script lang="ts">
  import { DownloadIcon, FileIcon } from "@canonical/svelte-icons";
  import { MediaQuery } from "svelte/reactivity";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    Breadcrumbs,
    Chip,
    DateTime,
    DescriptionList,
    Link,
    Log,
    UserChip,
  } from "$lib/components/index.js";
  import type { DateTimeProps, TimeZone } from "$lib/components/index.js";
  import {
    CommandList,
    JobStatusIcon,
  } from "$lib/launchpad-components/index.js";
  import {
    LogHeader,
    NoLogs,
    TrailingBar,
  } from "$lib/modules/job-manager/index.js";
  import { bytesToHumanReadable } from "$lib/utils/index.js";
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();

  const job = $derived(data.job);

  let wrapLines = $state(false);
  let timeZone = $state<TimeZone>("UTC");
  let showTimestamps = $state(true);

  const logTopId = "log-top";
  const logBottomId = "log-bottom";

  /* 
  There is a bug in Chrome, that makes it ignore `scroll-margin` for global scroll on elements that have a parent with non-visible overflow. https://issues.chromium.org/issues/40074749
  
  This makes the first three lines of log hidden behind the sticky header when scrolling to top of log in mobile view with line wrapping disabled (log container overflow needed).

  As a workaround, we detect this case and instead of scrolling to the top of the log, we scroll to the log header above it, which is outside of the overflow container.

  TODO: This can be removed once the bug is fixed in Chrome.
  */
  const logHeaderId = "log-header";
  const needsFallbackScrollMarginFix = $derived(
    browser &&
      (window as { chrome?: unknown })?.chrome &&
      new MediaQuery("max-width: 1036px").current,
  );
</script>

<div class="page">
  <Breadcrumbs
    segments={[
      { label: "Build farm", href: resolve("/jobs") },
      { label: job.id.toString() },
    ]}
    style="grid-area: breadcrumbs; border-block-end: var(--border-section-separator); align-self: stretch;"
  />

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
    <h2 class="visually-hidden" id={logHeaderId}>Log</h2>
    {#if data.log.length}
      <LogHeader
        bind:wrapLines
        bind:timeZone
        bind:showTimestamps
        viewLogUrl={data.logUrl}
        downloadLogUrl={data.logUrl}
        scrollToTopHref={needsFallbackScrollMarginFix
          ? `#${logHeaderId}`
          : `#${logTopId}`}
        scrollToBottomHref={`#${logBottomId}`}
      />
      <div class="log-contents">
        <Log
          style="flex-grow: 1;"
          {timeZone}
          {wrapLines}
          hideTimestamps={!showTimestamps}
        >
          {#each data.log as { timestamp, message }, i (i)}
            <Log.Line
              id={i === 0
                ? logTopId
                : i === data.log.length - 1
                  ? logBottomId
                  : undefined}
              line={i + 1}
              {timestamp}>{message}</Log.Line
            >
          {/each}
        </Log>
        {#if job.status === "EXECUTING" && job.started_at}
          <TrailingBar
            trailingMinutes={Math.floor(
              (Date.now() - new Date(job.started_at).getTime()) / 60000,
            )}
          />
        {/if}
      </div>
    {:else}
      <NoLogs
        message="The log stream will appear here once the build starts."
      />
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

    /* Defined height, to make sure scroll to log top is precise */
    --header-height: calc(var(--tmp-dimension-spacing-block-xs) * 2 + 1lh);

    grid-template:
      "breadcrumbs log-container" var(--header-height)
      "details log-container" minmax(0, 1fr) / minmax(300px, 3fr) 5fr;

    --border-section-separator: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-low-contrast);
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

    .log-contents {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }

  @media (max-width: 1036px) {
    .page {
      height: auto;
      min-height: 100vh;
      grid-template:
        "breadcrumbs" var(--header-height)
        "details" auto
        "log-container" 1fr / 1fr;
    }

    .log-container {
      display: flex;
      flex-direction: column;

      border-inline-start: none;
      border-block-start: var(--border-section-separator);

      :global {
        #log-top {
          scroll-margin-top: var(--header-height);
        }
      }
    }
  }
</style>
