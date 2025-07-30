<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers";
  import { Icon } from "../Icon";
  import Chip from "./Chip.svelte";

  const { Story } = defineMeta({
    title: "Chip",
    tags: ["autodocs"],
    component: Chip,
  });
</script>

<Story
  name="Default interactive chip"
  args={{
    value: "Value",
    onClick: fn(),
  }}
/>

<Story name="Severities" args={{}}>
  {#snippet template()}
    {#each SEMANTIC_MODIFIERS.severity as modifier (modifier)}
      <Chip
        key="Severity"
        value={modifier.charAt(0).toUpperCase() + modifier.slice(1)}
        modifiers={[modifier]}
      />
      <Chip key="Lead" value="Value" modifiers={[modifier]} />
      <br />
      <br />
    {/each}
  {/snippet}
</Story>

<Story
  name="With icon and lead"
  args={{
    key: "Lead",
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
    value: "Value",
    onDismiss: fn(),
  }}
/>

<Story
  name="Dense chip"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["dense"],
  }}
/>

<Story
  name="Read-only"
  args={{
    value: "Value",
    isReadonly: true,
  }}
/>

<Story name="Read-only severities" args={{}}>
  {#snippet template()}
    {#each SEMANTIC_MODIFIERS.severity as modifier (modifier)}
      <Chip
        key="Severity"
        value={modifier.charAt(0).toUpperCase() + modifier.slice(1)}
        modifiers={[modifier]}
        isReadonly
      />
      <Chip key="Lead" value="Value" modifiers={[modifier]} isReadonly />
      <br />
      <br />
    {/each}
  {/snippet}
</Story>

<Story
  name="Read-only positive dense"
  args={{
    key: "Lead",
    value: "Value",
    isReadonly: true,
    modifiers: ["positive", "dense"],
  }}
/>

<Story
  name="Read-only negative"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["negative"],
    isReadonly: true,
  }}
/>
