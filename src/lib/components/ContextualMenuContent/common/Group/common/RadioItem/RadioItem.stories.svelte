<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import RadioItem from "./RadioItem.svelte";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/RadioItem",
    tags: ["autodocs"],
    component: RadioItem,
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
      value: {
        table: { disable: true },
      },
      group: {
        table: {
          disable: true,
        },
      },
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
