<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Item from "./Item.svelte";

  const { Story } = defineMeta({
    title: "Components/Accordion/Item",
    tags: ["autodocs"],
    component: Item,
    argTypes: {
      heading: { control: "text" },
      children: { control: false },
      open: { control: { type: "boolean" }, defaultValue: false },
    },
  });
</script>

<Story name="Default" args={{ heading: "Standalone item" }}>
  {#snippet template({ children: _, ...args })}
    <Item {...args}>
      `Accordion.Item` works on its own without a parent `Accordion`.
    </Item>
  {/snippet}
</Story>

<Story name="Snippet heading">
  {#snippet template({ heading: _, children: __, ...args })}
    <Item {...args}>
      {#snippet heading()}
        <strong>Heading</strong> with rich content
      {/snippet}
      Pass a snippet when the heading needs richer markup than plain text.
    </Item>
  {/snippet}
</Story>
