<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import { Badge } from "$lib/components/Badge/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
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

<Story name="Severities" args={{}}>
  {#snippet template()}
    {#each SEMANTIC_MODIFIERS.SEVERITY as modifier (modifier)}
      <Chip
        lead="Severity"
        value={modifier.charAt(0).toUpperCase() + modifier.slice(1)}
        modifiers={[modifier]}
        onclick={fn()}
      />
      <Chip lead="Lead" value="Value" modifiers={[modifier]} onclick={fn()} />
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
    modifiers: ["caution"],
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

<Story
  name="Dense chip"
  args={{
    lead: "Lead",
    value: "Value",
    modifiers: ["dense"],
  }}
/>

<Story
  name="Read-only"
  args={{
    value: "Value",
    modifiers: ["readonly"],
  }}
/>

<Story name="Read-only severities" args={{}}>
  {#snippet template()}
    {#each SEMANTIC_MODIFIERS.SEVERITY as modifier (modifier)}
      <Chip
        lead="Severity"
        value={modifier.charAt(0).toUpperCase() + modifier.slice(1)}
        modifiers={["readonly", modifier]}
      >
        {#snippet badge()}
          <Badge value={420} />
        {/snippet}
      </Chip>
      <Chip lead="Lead" value="Value" modifiers={["readonly", modifier]} />
      <br />
      <br />
    {/each}
  {/snippet}
</Story>

<Story
  name="Read-only positive dense chip"
  args={{
    lead: "Lead",
    value: "Value",
    modifiers: ["readonly", "dense", "positive"],
  }}
/>

<Story
  name="Read-only negative chip"
  args={{
    lead: "Lead",
    value: "Value",
    modifiers: ["readonly", "negative"],
  }}
/>

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
