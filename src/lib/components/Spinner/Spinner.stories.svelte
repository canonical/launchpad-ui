<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Spinner from "./Spinner.svelte";

  const { Story } = defineMeta({
    title: "Components/Spinner",
    tags: ["autodocs"],
    component: Spinner,
  });
</script>

<Story name="Default" />
