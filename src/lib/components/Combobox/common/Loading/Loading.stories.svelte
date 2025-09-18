<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Combobox } from "../../index.js";
  import Loading from "./Loading.svelte";

  const { Story } = defineMeta({
    title: "Components/Combobox/Loading",
    tags: ["autodocs"],
    component: Loading,
  });
</script>

<Story name="Default" asChild>
  <Combobox.Loading />
</Story>

<Story name="With custom content" asChild>
  <Combobox.Loading>Fetching data…</Combobox.Loading>
</Story>
