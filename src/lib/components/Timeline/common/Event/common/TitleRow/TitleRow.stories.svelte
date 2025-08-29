<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import TitleRow from "./TitleRow.svelte";

  const { Story } = defineMeta({
    title: "Components/Timeline/Event/TitleRow",
    tags: ["autodocs"],
    component: TitleRow,
    args: {
      leadingText: "Alvarez Daniella",
      date: new Date("2023-03-15"),
      children:
        "added labels: Don't merge, Maintenance, Review: QA needed" as unknown as Snippet,
    },
  });
</script>

<Story name="Default" />
