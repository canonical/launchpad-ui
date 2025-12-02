<script module lang="ts">
  import { ArchiveIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import { Badge } from "$lib/components/Badge/index.js";
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers";
  import Chip from "./Chip.svelte";

  const { Story } = defineMeta({
    title: "Components/Chip",
    tags: ["autodocs"],
    component: Chip,
  });
</script>

<Story
  name="Default interactive chip"
  args={{
    value: "Value",
    onclick: fn(),
  }}
/>

<Story name="Severities">
  {#snippet template(args)}
    {#each SEMANTIC_MODIFIERS.severity as severity (severity)}
      <Chip
        {...args}
        lead="Severity"
        value={severity}
        {severity}
        onclick={fn()}
      />
      <br />
      <br />
    {/each}
  {/snippet}
</Story>

<Story
  name="With icon and lead"
  args={{
    lead: "Lead",
    value: "Value",
    severity: "caution",
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet icon()}
        <ArchiveIcon />
      {/snippet}
    </Chip>
  {/snippet}
</Story>

<Story
  name="Dismissable chip"
  args={{
    lead: "Owner",
    value: "Bob",
    ondismiss: fn(),
  }}
/>

<Story
  name="With a badge"
  args={{
    lead: "Lead",
    value: "Value",
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet badge()}
        <Badge value={42} />
      {/snippet}
    </Chip>
  {/snippet}
</Story>

<Story name="Read-only">
  {#snippet template(args)}
    {#each [undefined, ...SEMANTIC_MODIFIERS.severity] as severity (severity)}
      <Chip
        {...args}
        lead="Severity"
        value={severity || "default"}
        readonly
        {severity}
      >
        {#snippet badge()}
          <Badge value={420} />
        {/snippet}
      </Chip>
      <br />
      <br />
    {/each}
  {/snippet}
</Story>

<Story
  name="With all the elements"
  tags={["!autodocs"]}
  args={{
    lead: "Lead",
    value: "Value",
    ondismiss: fn(),
    onclick: fn(),
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet icon()}
        <ArchiveIcon />
      {/snippet}
      {#snippet badge()}
        <Badge value={420} />
      {/snippet}
    </Chip>
  {/snippet}
</Story>
