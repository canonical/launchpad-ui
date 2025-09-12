<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Loading from "./Loading.svelte";

  const { Story } = defineMeta({
    title: "Components/Combobox/Loading",
    tags: ["autodocs"],
    component: Loading,
  });
</script>

<Story name="Default" />

<Story name="With custom content" asChild>
  <Loading>Fetching data…</Loading>
</Story>
