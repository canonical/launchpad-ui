<script lang="ts">
  import {
    Button,
    Chip,
    DescriptionList,
    Link,
  } from "@canonical/svelte-ds-app-launchpad";
  import { DownloadIcon, FileIcon } from "@canonical/svelte-icons";
  import { jobManagerHref } from "$lib/api/job-manager/hrefClient.js";
  import type { JobRead } from "$lib/api/job-manager/types.js";
  import { Accordion, UserChip } from "$lib/components/index.js";
  import {
    CommandList,
    DateTime,
    JobStatusIcon,
    PartialListDisclosure,
  } from "$lib/launchpad-components/index.js";
  import { bytesToHumanReadable } from "$lib/utils/bytesToHumanReadable.js";

  const { job }: { job: JobRead } = $props();

  const jobManagerLog = $derived(
    job.objects?.find(
      (obj) => obj.object_type === "log" && obj.filename === "job_agent.log",
    ),
  );

  const artifacts = $derived(
    job.objects?.filter((obj) => obj.object_type === "artifact") ?? [],
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
            <DateTime date={job.created_at} />
          </DescriptionList.Item>
          <DescriptionList.Item name="Updated">
            <DateTime date={job.updated_at} />
          </DescriptionList.Item>
          {#if job.started_at}
            <DescriptionList.Item name="Started">
              <DateTime date={job.started_at} />
            </DescriptionList.Item>
          {/if}
          {#if job.completed_at}
            <DescriptionList.Item name="Finished">
              <DateTime date={job.completed_at} />
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
                href={jobManagerHref("/v1/jobs/{job_id}/object/{object_name}", {
                  path: {
                    job_id: job.id,
                    object_name: jobManagerLog.filename,
                  },
                })}
                download
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
  <Accordion class="job-accordion">
    {#if artifacts?.length}
      <Accordion.Item class="job-section">
        {#snippet heading()}
          <div class="artifacts-header">
            <h2>{artifacts.length} Artifacts</h2>
            <Button
              href={jobManagerHref("/v1/jobs/{job_id}/artifacts/download", {
                path: { job_id: job.id },
              })}
              density="dense"
              severity="base"
              download
              target="_blank"
              rel="noopener noreferrer"
              onclick={(event: MouseEvent) => event.stopPropagation()}
            >
              {#snippet iconLeft()}
                <DownloadIcon />
              {/snippet}
              Download All
            </Button>
          </div>
        {/snippet}
        <ul class="artifacts">
          {#each artifacts as { size_bytes, object_type, filename } (`${object_type}/${filename}`)}
            <li>
              <Link
                href={jobManagerHref("/v1/jobs/{job_id}/object/{object_name}", {
                  path: {
                    job_id: job.id,
                    object_name: filename,
                  },
                })}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="icon-aligner">
                  <FileIcon aria-hidden="true" />
                </span>
                <span class="artifact-name">
                  {filename} ({bytesToHumanReadable(size_bytes ?? 0)})
                </span>
              </Link>
            </li>
          {/each}
        </ul>
      </Accordion.Item>
    {/if}
    <Accordion.Item class="job-section" open>
      {#snippet heading()}
        <h2>Commands</h2>
      {/snippet}
      <CommandList>
        {#each job.commands as command, i (i)}
          <!--
        TODO(job-manager):
          - pass precise command status (currently derived from job status)
          - command not as `unknown` but proper type
          - link command to log entry

        TODO: Syntax highlighting for command
      -->
          <CommandList.Command
            status={job.status}
            command={command as string}
            href={undefined}
          />
        {/each}
      </CommandList>
    </Accordion.Item>
  </Accordion>
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

    section {
      padding-block-end: var(--lp-dimension-spacing-block-m);
      border-block-end: var(--border-section-separator);
    }

    :global(.job-accordion) {
      --dimension-border-thickness-accordion: 0;
      --dimension-radius-accordion: 0;
    }

    :global(.job-section) {
      --color-border-accordion-item: var(--lp-color-border-low-contrast);
      --dimension-padding-inline-accordion-summary: 0;
      --dimension-padding-inline-accordion-content: 0;
      --color-background-accordion-summary-hover: transparent;
      --color-background-accordion-summary-active: transparent;
    }

    .artifacts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--lp-dimension-spacing-inline-xs);
      flex: 1;
      min-width: 0;
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
