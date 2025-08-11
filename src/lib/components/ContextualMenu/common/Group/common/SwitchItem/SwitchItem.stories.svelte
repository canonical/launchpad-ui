<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { commonArgTypes } from "../stories.js";
  import SwitchItem from "./SwitchItem.svelte";

  const { Story } = defineMeta({
    title: "ContextualMenu/Items/SwitchItem",
    tags: ["autodocs"],
    component: SwitchItem,
    argTypes: {
      ...commonArgTypes,
    },
  });
</script>

<Story name="Default" args={{ text: "Text" }} />

<Story
  name="With secondary text"
  args={{ text: "Text", secondaryText: "Secondary Text" }}
/>

<Story
  name="With trailing text"
  args={{ text: "Text", trailingText: "Trailing Text" }}
/>

<Story name="With icon" args={{ text: "Text" }}>
  {#snippet template(args)}
    <SwitchItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </SwitchItem>
  {/snippet}
</Story>

<Story
  name="With all contents"
  args={{
    text: "Text",
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
  }}
>
  {#snippet template(args)}
    <SwitchItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </SwitchItem>
  {/snippet}
</Story>

<Story
  name="Disabled"
  args={{
    text: "Text",
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
    disabled: true,
  }}
>
  {#snippet template(args)}
    <SwitchItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </SwitchItem>
  {/snippet}
</Story>
