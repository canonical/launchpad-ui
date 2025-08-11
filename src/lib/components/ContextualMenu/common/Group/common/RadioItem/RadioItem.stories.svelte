<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { commonArgTypes } from "../stories.js";
  import RadioItem from "./RadioItem.svelte";

  const { Story } = defineMeta({
    title: "ContextualMenu/Items/RadioItem",
    tags: ["autodocs"],
    component: RadioItem,
    argTypes: {
      ...commonArgTypes,
    },
    args: {
      text: "Text",
    },
  });
</script>

<Story name="Default" />

<Story
  name="With secondary text"
  args={{
    secondaryText: "Secondary Text",
  }}
/>

<Story
  name="With trailing text"
  args={{
    trailingText: "Trailing Text",
  }}
/>

<Story name="With icon">
  {#snippet template(args)}
    <RadioItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </RadioItem>
  {/snippet}
</Story>

<Story
  name="With all contents"
  args={{
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
  }}
>
  {#snippet template(args)}
    <RadioItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </RadioItem>
  {/snippet}
</Story>

<Story
  name="Disabled"
  args={{
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
    disabled: true,
  }}
>
  {#snippet template(args)}
    <RadioItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </RadioItem>
  {/snippet}
</Story>
