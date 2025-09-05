<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Item from "./Item.svelte";

  const { Story } = defineMeta({
    title: "Components/SingleSelectCombobox/Item",
    tags: ["autodocs"],
    component: Item,
  });
</script>

<Story name="Default" />
