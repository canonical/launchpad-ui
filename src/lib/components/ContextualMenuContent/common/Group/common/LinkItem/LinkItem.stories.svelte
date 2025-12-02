<script module lang="ts">
  import { EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import LinkItem from "./LinkItem.svelte";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/LinkItem",
    tags: ["autodocs"],
    component: LinkItem,
    argTypes: {
      icon: {
        control: false,
      },
      disabled: {
        control: "boolean",
        description: "Whether the item is disabled.",
        table: {
          type: {
            summary: "boolean",
          },
        },
      },
      href: {
        table: {
          category: "properties",
        },
      },
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
        <EditIcon />
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
        <EditIcon />
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
        <EditIcon />
      {/snippet}
    </LinkItem>
  {/snippet}
</Story>
