<!-- @canonical/generator-ds 0.9.0-experimental.22 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Box from "./Box.svelte";

  /*
    CSF3 story
    Uses the latest Storybook format for Svelte.
  */
  const { Story } = defineMeta({
    title: "Box",
    tags: ["autodocs"],
    component: Box,
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">Box</Story>

<Story
  name="With Props"
  args={{
    class: "custom-class",
    id: "unique-id",
    style: "background-color: tomato; padding: 10px; color: white;",
  }}
>
  Box with props
</Story>
