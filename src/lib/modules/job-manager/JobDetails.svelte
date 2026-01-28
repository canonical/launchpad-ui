<script lang="ts">
  import { DownloadIcon, FileIcon } from "@canonical/svelte-icons";
  import type { JobRead } from "$lib/api/job-manager/types.js";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    Chip,
    DateTime,
    DescriptionList,
    Link,
    UserChip,
  } from "$lib/components/index.js";
  import {
    CommandList,
    JobStatusIcon,
  } from "$lib/launchpad-components/index.js";
  import { bytesToHumanReadable } from "$lib/utils/bytesToHumanReadable.js";

  const { job }: { job: JobRead } = $props();
</script>

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
    <DescriptionList layout="auto">
      <DescriptionList.Item name="ID">
        {job.id}
      </DescriptionList.Item>
      <DescriptionList.Item name="Architecture">
        {job.architecture}
      </DescriptionList.Item>
      <DescriptionList.Item name="Requested by">
        <UserChip userName={job.requested_by} size="small" />
      </DescriptionList.Item>
      <DescriptionList.Item name="Created at">
        <DateTime date={job.created_at} absolute />
      </DescriptionList.Item>
      <DescriptionList.Item name="Updated at">
        <DateTime date={job.updated_at} absolute />
      </DescriptionList.Item>
      <DescriptionList.Item name="Started at">
        {#if job.started_at}
          <DateTime date={job.started_at} absolute />
        {/if}
      </DescriptionList.Item>
      <DescriptionList.Item name="Completed at">
        {#if job.completed_at}
          <DateTime date={job.completed_at} absolute />
        {/if}
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

<style>
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
</style>
