<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { commonArgTypes } from "../stories.js";
  import CheckboxItem from "./CheckboxItem.svelte";

  const { Story } = defineMeta({
    title: "ContextualMenu/Items/CheckboxItem",
    tags: ["autodocs"],
    component: CheckboxItem,
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
    <CheckboxItem {...args} checked={false}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </CheckboxItem>
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
    <CheckboxItem {...args} checked={false}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </CheckboxItem>
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
    <CheckboxItem {...args} checked={false}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </CheckboxItem>
  {/snippet}
</Story>
