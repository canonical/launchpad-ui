<script module lang="ts">
  import { EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ButtonItem from "./ButtonItem.svelte";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/ButtonItem",
    tags: ["autodocs"],
    component: ButtonItem,
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
          category: "properties",
        },
      },
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
        <EditIcon />
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
        <EditIcon />
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
        <EditIcon />
      {/snippet}
    </ButtonItem>
  {/snippet}
</Story>

<Story
  name="As link"
  args={{
    href: "https://example.com",
    target: "_blank",
  }}
>
  {#snippet template(args)}
    <ButtonItem {...args}>
      {#snippet icon()}
        <EditIcon />
      {/snippet}
    </ButtonItem>
  {/snippet}
</Story>
