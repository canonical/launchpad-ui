<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { defaultLogObjectName } from "$lib/api/job-manager/constants.js";
  import { jobManagerHref } from "$lib/api/job-manager/hrefClient.js";
  import { Breadcrumbs, Log } from "$lib/components/index.js";
  import type { TimeZone } from "$lib/components/index.js";
  import {
    JobDetails,
    LogHeader,
    NoLogs,
    TrailingBar,
  } from "$lib/modules/job-manager/job-details/index.js";
  import { useFullScreen } from "$lib/modules/job-manager/useFullScreen.svelte.js";
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

  const fullScreen = useFullScreen();
  const defaultLog = $derived(
    job.objects?.find(
      (obj) =>
        obj.object_type === "log" && obj.filename === defaultLogObjectName,
    ),
  );

  function defaultLogHref(inline: boolean) {
    if (!defaultLog) return undefined;

    return jobManagerHref("/v1/jobs/{job_id}/object/{object_name}", {
      path: {
        job_id: job.id,
        object_name: defaultLog.filename,
      },
      query: {
        inline,
      },
    });
  }

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
      !fullScreen.isEnabled &&
      new MediaQuery("max-width: 1036px").current,
  );
</script>

<main class:log-full-screen={fullScreen.isEnabled}>
  {#if !fullScreen.isEnabled}
    <Breadcrumbs
      segments={[
        { label: "Build farm", href: resolve("/jobs") },
        { label: job.id.toString() },
      ]}
      style="grid-area: breadcrumbs; border-block-end: var(--border-section-separator); align-self: stretch;"
    />
    <JobDetails {job} />
  {/if}
  <section class="log-container" class:log-full-screen={fullScreen.isEnabled}>
    <h2 class="visually-hidden" id={logHeaderId}>Log</h2>
    {#if data.log.length}
      <LogHeader
        bind:wrapLines
        bind:timeZone
        bind:showTimestamps
        viewLogUrl={defaultLogHref(true)}
        downloadLogUrl={defaultLogHref(false)}
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
</main>

<style>
  main {
    display: grid;
    height: 100vh;

    /* Defined height, to make sure scroll to log top is precise */
    --header-height: calc(var(--lp-dimension-spacing-block-xs) * 2 + 1lh);

    grid-template:
      "breadcrumbs log-container" var(--header-height)
      "details log-container" minmax(0, 1fr) / minmax(300px, 3fr) 5fr;

    --border-section-separator: var(--dimension-stroke-thickness-default) solid
      var(--lp-color-border-low-contrast);

    &.log-full-screen {
      grid-template:
        "log-container" var(--header-height)
        "log-container" minmax(0, 1fr) / 1fr;
    }
  }

  .log-container {
    grid-area: log-container;
    display: grid;
    grid-template-rows: subgrid;

    border-inline-start: var(--dimension-stroke-thickness-default) solid
      var(--lp-color-border-default);

    .log-contents {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    &.log-full-screen {
      border-inline-start: none;
    }
  }

  @media (max-width: 1036px) {
    main:not(.log-full-screen) {
      height: auto;
      min-height: 100vh;
      grid-template:
        "breadcrumbs" var(--header-height)
        "details" auto
        "log-container" 1fr / 1fr;

      .log-container {
        display: flex;
        flex-direction: column;
        border-block-start: var(--border-section-separator);

        :global {
          #log-top {
            scroll-margin-top: var(--header-height);
          }
        }
      }
    }

    .log-container {
      border-inline-start: none;
    }
  }
</style>
