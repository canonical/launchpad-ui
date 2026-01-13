<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import JobStatusIcon from "./JobStatusIcon.svelte";

  const { Story } = defineMeta({
    title: "Launchpad Components/JobStatusIcon",
    tags: ["autodocs"],
    component: JobStatusIcon,
    args: {
      status: "PENDING",
    },
  });
</script>

<Story name="Default" />

<Story
  name="With Different Statuses"
  argTypes={{ status: { table: { disable: true } } }}
  asChild
>
  {#each ["PENDING", "EXECUTING", "IDLE", "FINISHED", "FAILED", "CANCELLED", null] as const as status (status)}
    <div
      style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"
    >
      <JobStatusIcon {status} />
      <span>{status ?? "null"}</span>
    </div>
  {/each}
</Story>

<Story name="With Default Color Override">
  {#snippet template(args)}
    <JobStatusIcon status={args.status} --job-status-icon-color="crimson" />
  {/snippet}
</Story>
