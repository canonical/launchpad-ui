<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers";
  import { LAUNCHPAD_MODIFIERS } from "$lib/modifiers-app";
  import type { IconName } from "../Icon/iconNames";
  import { Icon, MulticolorIcon } from "../index.js";
  import IconText from "./IconText.svelte";

  const { Story } = defineMeta({
    title: "Components/IconText",
    tags: ["autodocs"],
    component: IconText,
  });

  const mpReviewIcons = {
    pending: "spinner",
    approve: "success",
    "needs-fixing": "warning-grey",
    disapprove: "error-grey",
  } satisfies Record<
    (typeof LAUNCHPAD_MODIFIERS.MERGE_PROPOSAL_REVIEW)[number],
    IconName
  >;
</script>

<!-- {#snippet render(args: IconTextProps)}
  <IconText {...args} />
{/snippet} -->

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">
  {#snippet template(args)}
    <IconText {...args}>
      {#snippet icon()}
        <Icon name="success" />
      {/snippet}
      CI runs passed
    </IconText>
  {/snippet}
</Story>

<Story name="Sizes">
  {#snippet template(args)}
    {#each [...SEMANTIC_MODIFIERS.SIZE, undefined] as size (size)}
      <IconText {...args} modifiers={[size]}>
        {#snippet icon()}
          <MulticolorIcon name="success" />
        {/snippet}
        CI runs passed ({size || "default"})
      </IconText>
      <br />
    {/each}
  {/snippet}
</Story>

<Story name="Merge Proposal Review">
  {#snippet template(args)}
    {#each LAUNCHPAD_MODIFIERS.MERGE_PROPOSAL_REVIEW as review (review)}
      <IconText {...args} modifiers={[review]}>
        {#snippet icon()}
          <Icon name={mpReviewIcons[review]} />
        {/snippet}
        {review}
      </IconText>
      <br />
    {/each}
  {/snippet}
</Story>

<Story name="Merge Proposal Job Status">
  {#snippet template(args)}
    <IconText {...args} modifiers={["job-success"]}>
      {#snippet icon()}
        <Icon name="success" />
      {/snippet}
      Success
    </IconText><br />
    <IconText {...args} modifiers={["job-failed"]}>
      {#snippet icon()}
        <Icon name="error-grey" />
      {/snippet}
      Failed
    </IconText><br />
    <IconText {...args} modifiers={["job-skipped"]}>
      {#snippet icon()}
        <Icon name="skip" />
      {/snippet}
      Skipped
    </IconText><br />
    <IconText {...args} modifiers={["job-skipped"]}>
      {#snippet icon()}
        <Icon name="loading-steps" />
      {/snippet}
      Pending
    </IconText><br />
    <IconText {...args} modifiers={["job-skipped"]}>
      {#snippet icon()}
        <Icon name="unit-pending" />
      {/snippet}
      Queued
    </IconText><br />
    <IconText {...args}>
      {#snippet icon()}
        <Icon name="spinner" />
      {/snippet}
      Skipped
    </IconText>
  {/snippet}
</Story>
