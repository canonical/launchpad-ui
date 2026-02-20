<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ItemsCount from "./ItemsCount.svelte";

  const { Story } = defineMeta({
    title: "Components/Pagination/ItemsCount",
    tags: ["autodocs"],
    component: ItemsCount,
  });
</script>

<Story name="Default" args={{ showing: 5, total: 10 }} />
