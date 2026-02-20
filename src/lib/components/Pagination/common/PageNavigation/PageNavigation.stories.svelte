<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { setPaginationContext } from "../../context.js";
  import PageNavigation from "./PageNavigation.svelte";

  const { Story } = defineMeta({
    title: "Components/Pagination/PageNavigation",
    tags: ["autodocs"],
    component: PageNavigation,
  });
</script>

<script lang="ts">
  setPaginationContext({
    tableId: "example-table",
  });
</script>

<Story name="Previous" args={{ direction: "previous" }} />

<Story name="Next" args={{ direction: "next" }} />

<Story name="First" args={{ direction: "first" }} />

<Story name="Last" args={{ direction: "last" }} />

<Story
  name="Disabled"
  argTypes={{ direction: { control: false } }}
  args={{ disabled: true }}
>
  {#snippet template({ direction: _, ...args })}
    <PageNavigation direction="first" {...args} />
    <PageNavigation direction="previous" {...args} />
    <PageNavigation direction="next" {...args} />
    <PageNavigation direction="last" {...args} />
  {/snippet}
</Story>
