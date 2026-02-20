<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { setPaginationContext } from "../../context.js";
  import PageSelect from "./PageSelect.svelte";

  const { Story } = defineMeta({
    title: "Components/Pagination/PageSelect",
    tags: ["autodocs"],
    component: PageSelect,
  });
</script>

<script lang="ts">
  setPaginationContext({
    tableId: "example-table",
  });
</script>

<Story name="Default" args={{ totalPages: 10 }}>
  {#snippet template({ children: _, ...args })}
    <PageSelect {...args}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3" selected>3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </PageSelect>
  {/snippet}
</Story>
