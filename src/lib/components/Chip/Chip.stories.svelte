<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import { Badge } from "$lib/components/Badge/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import { SEMANTIC_MODIFIERS, modifiersControl } from "$lib/modifiers";
  import Chip from "./Chip.svelte";
  import { chipModifiers } from "./modifiers";

  const { Story } = defineMeta({
    title: "Components/Chip",
    tags: ["autodocs"],
    component: Chip,
    argTypes: {
      ...modifiersControl(chipModifiers),
    },
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
        modifiers={{ ...(args.modifiers || {}), severity }}
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
    modifiers: { severity: "caution" },
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet icon()}
        <Icon name="archive" />
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
        modifiers={{
          ...(args.modifiers || {}),
          readMode: "readonly",
          severity,
        }}
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
        <Icon name="archive" />
      {/snippet}
      {#snippet badge()}
        <Badge value={420} />
      {/snippet}
    </Chip>
  {/snippet}
</Story>
