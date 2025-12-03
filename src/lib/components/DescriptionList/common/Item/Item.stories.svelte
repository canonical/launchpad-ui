<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { DescriptionList } from "../../index.js";
  import Item from "./Item.svelte";

  const { Story } = defineMeta({
    title: "Components/DescriptionList/Item",
    tags: ["autodocs"],
    component: Item,
    args: {
      term: "Example term",
      children: "Example description" as unknown as Snippet,
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <DescriptionList>
      <DescriptionList.Item {...args} />
    </DescriptionList>
  {/snippet}
</Story>

<Story name="Vertical" args={{ orientation: "vertical" }}>
  {#snippet template(args)}
    <DescriptionList>
      <DescriptionList.Item {...args} />
    </DescriptionList>
  {/snippet}
</Story>
