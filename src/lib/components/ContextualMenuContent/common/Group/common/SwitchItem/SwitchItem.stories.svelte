<script module lang="ts">
  import { EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import SwitchItem from "./SwitchItem.svelte";

  const { Story } = defineMeta({
    title: "Components/ContextualMenuContent/SwitchItem",
    tags: ["autodocs"],
    component: SwitchItem,
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
      value: {
        table: { disable: true },
      },
      group: {
        table: {
          disable: true,
        },
      },
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
        <EditIcon />
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
        <EditIcon />
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
        <EditIcon />
      {/snippet}
    </SwitchItem>
  {/snippet}
</Story>
