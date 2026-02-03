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
    PartialListDisclosure,
  } from "$lib/launchpad-components/index.js";
  import { bytesToHumanReadable } from "$lib/utils/bytesToHumanReadable.js";

  const { job }: { job: JobRead } = $props();

  const jobManagerLog = $derived(
    // TODO: Remove `as string[]` when API types are fixed
    (job.log_urls as string[]).find((url) => url.endsWith("job_agent.log")),
  );
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
    <PartialListDisclosure>
      {#snippet children(
        listProps,
        hiddenItemProps,
        toggleButtonProps,
        isExpanded,
      )}
        <DescriptionList {...listProps} layout="auto">
          <DescriptionList.Item name="ID">
            {job.id}
          </DescriptionList.Item>
          <DescriptionList.Item name="Requested by">
            <UserChip userName={job.requested_by} size="small" />
          </DescriptionList.Item>
          <DescriptionList.Item name="Created">
            <DateTime date={job.created_at} absolute />
          </DescriptionList.Item>
          <DescriptionList.Item name="Updated">
            <DateTime date={job.updated_at} absolute />
          </DescriptionList.Item>
          {#if job.started_at}
            <DescriptionList.Item name="Started">
              <DateTime date={job.started_at} absolute />
            </DescriptionList.Item>
          {/if}
          {#if job.completed_at}
            <DescriptionList.Item name="Finished">
              <DateTime date={job.completed_at} absolute />
            </DescriptionList.Item>
          {/if}
          <!-- TODO: Duration -->
          <DescriptionList.Item {...hiddenItemProps} name="Repository">
            <span style="overflow-wrap: anywhere">
              {job.repository_url}
            </span>
          </DescriptionList.Item>
          <DescriptionList.Item {...hiddenItemProps} name="Repository ref">
            {job.repository_ref}
          </DescriptionList.Item>
          <DescriptionList.Item {...hiddenItemProps} name="Architecture">
            {job.architecture}
          </DescriptionList.Item>
          <DescriptionList.Item {...hiddenItemProps} name="Base series">
            {job.base_series}
          </DescriptionList.Item>
          {#if job.vm_size}
            <DescriptionList.Item {...hiddenItemProps} name="VM size">
              {job.vm_size}
            </DescriptionList.Item>
          {/if}
          {#if jobManagerLog}
            <DescriptionList.Item {...hiddenItemProps} name="Job manager log">
              <Link
                href={jobManagerLog}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </Link>
            </DescriptionList.Item>
          {/if}
        </DescriptionList>
        <!-- TODO: Proper link-looking button -->
        <button
          {...toggleButtonProps}
          style="margin-top: var(--lp-dimension-spacing-block-xs);"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      {/snippet}
    </PartialListDisclosure>
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
          style="display: flex; gap: var(--lp-dimension-spacing-inline-xs); align-items: center; padding: var(--lp-dimension-spacing-block-minimum) var(--lp-dimension-spacing-inline-xs);"
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

    padding-block: var(--lp-dimension-spacing-block-l);
    padding-inline: var(--lp-dimension-spacing-inline-l);

    h1 {
      font: var(--lp-typography-h3);
    }

    h2 {
      font: var(--lp-typography-h5);
    }

    .chips {
      display: flex;
      gap: var(--lp-dimension-spacing-inline-xxs);
      margin-block-start: var(--lp-dimension-spacing-block-xs);
    }

    section:first-of-type {
      margin-block-start: var(--lp-dimension-spacing-block-l);
    }

    section + section {
      margin-block-start: var(--lp-dimension-spacing-block-m);
      padding-block-start: var(--lp-dimension-spacing-block-m);
      border-block-start: var(--border-section-separator);
    }

    .section-header {
      margin-block-end: var(--lp-dimension-spacing-block-m);
    }

    .artifacts {
      list-style: none;
      display: grid;
      gap: var(--lp-dimension-spacing-block-xs);

      :global(a) {
        display: flex;
        align-items: start;
        gap: var(--lp-dimension-spacing-inline-xs);
        color: var(--lp-color-text-default);

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
