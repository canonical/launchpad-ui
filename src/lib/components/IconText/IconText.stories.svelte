<script module lang="ts">
  import { Error, Spinner, Success, Warning } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Component } from "svelte";
  import {
    LoadingSteps,
    Skip,
    UnitPending,
  } from "$lib/components/icons/index.js";
  import { SEMANTIC_MODIFIERS, modifiersControl } from "$lib/modifiers";
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
    approved: Success,
    disapproved: Error,
    "changes-requested": Warning,
    reviewing: Spinner,
  } satisfies Record<(typeof iconTextModifiers.approval)[number], Component>;
</script>

<Story name="Default">
  {#snippet template(args)}
    <IconText {...args}>
      {#snippet icon()}
        <Success />
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
          <Success />
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
          {@const Icon = mpReviewIcons[approval]}
          <Icon />
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
        <Success />
      {/snippet}
      Success
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "failed" }}
    >
      {#snippet icon()}
        <Error />
      {/snippet}
      Failed
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <Skip />
      {/snippet}
      Skipped
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "suspended" }}
    >
      {#snippet icon()}
        <LoadingSteps />
      {/snippet}
      Pending
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <UnitPending />
      {/snippet}
      Queued
    </IconText><br />
    <IconText
      {...args}
      modifiers={{ ...(args.modifiers || {}), lifecycle: "pending" }}
    >
      {#snippet icon()}
        <Spinner />
      {/snippet}
      Skipped
    </IconText>
  {/snippet}
</Story>
