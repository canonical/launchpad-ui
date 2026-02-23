<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import DateTime from "./DateTime.svelte";

  const { Story } = defineMeta({
    title: "Launchpad Components/DateTime",
    tags: ["autodocs"],
    component: DateTime,
    args: {
      date: "2023-10-01T12:16:10Z",
    },
  });
</script>

<Story name="Default" />
