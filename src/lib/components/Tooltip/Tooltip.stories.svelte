<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import Tooltip from "./Tooltip.svelte";

  const { Story } = defineMeta({
    title: "Components/Tooltip",
    tags: ["autodocs"],
    component: Tooltip,
    argTypes: {
      trigger: {
        control: false,
      },
    },
    args: {
      children: "Hello there!" as unknown as Snippet,
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <Tooltip {...args} />
  {/snippet}
</Story>
