<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { DateTime } from "$lib/components/DateTime/index.js";
  import TitleRow from "./TitleRow.svelte";

  const { Story } = defineMeta({
    title: "Components/Timeline/Event/TitleRow",
    tags: ["autodocs"],
    component: TitleRow,
    args: {
      leadingText: "Alvarez Daniella",
      date,
      children:
        "added labels: Don't merge, Maintenance, Review: QA needed" as unknown as Snippet,
    },
    argTypes: {
      date: {
        control: {
          disable: true,
        },
      },
    },
  });
</script>

{#snippet date()}
  <DateTime date={new Date("2023-03-15")} />
{/snippet}

<Story name="Default" />
