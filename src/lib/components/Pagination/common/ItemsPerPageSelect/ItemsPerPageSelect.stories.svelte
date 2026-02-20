<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { setPaginationContext } from "../../context.js";
  import ItemsPerPageSelect from "./ItemsPerPageSelect.svelte";

  const { Story } = defineMeta({
    title: "Components/Pagination/ItemsPerPageSelect",
    tags: ["autodocs"],
    component: ItemsPerPageSelect,
  });
</script>

<script lang="ts">
  setPaginationContext({
    tableId: "example-table",
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <ItemsPerPageSelect {...args}>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="50" selected>50</option>
      <option value="100">100</option>
    </ItemsPerPageSelect>
  {/snippet}
</Story>
