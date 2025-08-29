<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SEMANTIC_MODIFIERS, modifiersControl } from "$lib/modifiers";
  import type { IconName } from "../Icon/iconNames";
  import { Icon, MulticolorIcon } from "../index.js";
  import IconText from "./IconText.svelte";
  import { iconTextModifiers } from "./modifiers";

  const { Story } = defineMeta({
    title: "Components/IconText",
    tags: ["autodocs"],
    component: IconText,
    argTypes: {
      icon: {
        control: {
          disable: true,
        },
      },
      ...modifiersControl(iconTextModifiers),
    },
  });

  const mpReviewIcons = {
    approved: "success",
    disapproved: "error",
    "changes-requested": "warning",
    reviewing: "spinner",
  } satisfies Record<(typeof iconTextModifiers.approval)[number], IconName>;
</script>

<Story name="Default">
  {#snippet template(args)}
    <IconText {...args}>
      {#snippet icon()}
        <Icon name="success" />
      {/snippet}
      CI runs passed (medium)
    </IconText>
  {/snippet}
</Story>

<Story name="Sizes">
  {#snippet template(args)}
    {#each SEMANTIC_MODIFIERS.size as size (size)}
      <IconText {...args} modifiers={{ ...(args.modifiers || {}), size }}>
        {#snippet icon()}
          <MulticolorIcon name="success" />
        {/snippet}
        CI runs passed ({size})
      </IconText>
      <br />
    {/each}
  {/snippet}
</Story>

<Story name="Merge Proposal Review">
  {#snippet template(args)}
    {#each iconTextModifiers.approval as approval (approval)}
      <IconText {...args} modifiers={{ ...(args.modifiers || {}), approval }}>
        {#snippet icon()}
          <Icon name={mpReviewIcons[approval]} />
        {/snippet}
        {approval}
      </IconText>
      <br />
    {/each}
  {/snippet}
</Story>

<Story name="Merge Proposal Job Status">
  {#snippet template(args)}
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "completed" }}
    >
      {#snippet icon()}
        <Icon name="success" />
      {/snippet}
      Success
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "failed" }}
    >
      {#snippet icon()}
        <Icon name="error" />
      {/snippet}
      Failed
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <Icon name="skip" />
      {/snippet}
      Skipped
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "suspended" }}
    >
      {#snippet icon()}
        <Icon name="loading-steps" />
      {/snippet}
      Pending
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <Icon name="unit-pending" />
      {/snippet}
      Queued
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <Icon name="spinner" />
      {/snippet}
      Skipped
    </IconText>
  {/snippet}
</Story>
