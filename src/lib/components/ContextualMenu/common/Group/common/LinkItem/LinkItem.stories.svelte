<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { commonArgTypes } from "../stories.js";
  import LinkItem from "./LinkItem.svelte";

  const { Story } = defineMeta({
    title: "ContextualMenu/Items/LinkItem",
    tags: ["autodocs"],
    component: LinkItem,
    argTypes: {
      ...commonArgTypes,
    },
    args: {
      href: "#",
      text: "Text",
    },
  });
</script>

<Story name="Default" />

<Story name="With secondary text" args={{ secondaryText: "Secondary Text" }} />

<Story name="With trailing text" args={{ trailingText: "Trailing Text" }} />

<Story name="With icon">
  {#snippet template(args)}
    <LinkItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </LinkItem>
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
    <LinkItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </LinkItem>
  {/snippet}
</Story>

<Story
  name="Disabled"
  args={{
    secondaryText: "Secondary Text",
    trailingText: "Trailing Text",
    disabled: true,
    href: "#",
  }}
>
  {#snippet template(args)}
    <LinkItem {...args}>
      {#snippet icon()}
        <Icon name="edit" />
      {/snippet}
    </LinkItem>
  {/snippet}
</Story>
