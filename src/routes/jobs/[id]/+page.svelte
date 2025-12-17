<script lang="ts">
  import {
    DateTime,
    DescriptionList,
    UserChip,
  } from "$lib/components/index.js";
  import type { DateTimeProps } from "$lib/components/index.js";
  import { JobStatus } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<DescriptionList>
  <DescriptionList.Item name="ID">
    {data.job.id}
  </DescriptionList.Item>
  <DescriptionList.Item name="Architecture">
    {data.job.architecture}
  </DescriptionList.Item>
  <DescriptionList.Item name="Status">
    {#if data.job.status}
      <JobStatus status={data.job.status} />
    {/if}
  </DescriptionList.Item>
  <DescriptionList.Item name="Requested by">
    <UserChip userName={data.job.requested_by} />
  </DescriptionList.Item>
  <DescriptionList.Item name="Created at">
    {@render nullableDateTime(data.job.created_at)}
  </DescriptionList.Item>
  <DescriptionList.Item name="Started at">
    {@render nullableDateTime(data.job.started_at)}
  </DescriptionList.Item>
  <DescriptionList.Item name="Completed at">
    {@render nullableDateTime(data.job.completed_at)}
  </DescriptionList.Item>
</DescriptionList>

{#snippet nullableDateTime(date: DateTimeProps["date"] | null | undefined)}
  {#if date}
    <DateTime {date} absolute />
  {/if}
{/snippet}
