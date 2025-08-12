<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { commonArgTypes } from "../stories.js";
  import ButtonItem from "./ButtonItem.svelte";

  const { Story } = defineMeta({
    title: "ContextualMenuContent/Items/ButtonItem",
    tags: ["autodocs"],
    component: ButtonItem,
    argTypes: {
      ...commonArgTypes,
    },
    args: {
      text: "Text",
    },
  });
</script>

<Story name="Default" />

<Story name="With secondary text" args={{ secondaryText: "Secondary Text" }} />

<Story name="With trailing text" args={{ trailingText: "Trailing Text" }} />

<Story name="With icon">
  {#snippet template(args)}
    <ButtonItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </ButtonItem>
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
    <ButtonItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </ButtonItem>
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
    <ButtonItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </ButtonItem>
  {/snippet}
</Story>
