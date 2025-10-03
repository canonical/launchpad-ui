<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import LinkItem from "./LinkItem.svelte";
  // import type { LinkItemProps } from "./types.js";

  /*
    CSF3 story
    Uses the latest Storybook format for Svelte.
  */
  const { Story } = defineMeta({
    title: "LinkItem",
    tags: ["autodocs"],
    component: LinkItem,
    // Use render snippet for more control over story rendering.
    // see: https://github.com/storybookjs/addon-svelte-csf?tab=readme-ov-file#default-snippet
    // render,
  });
</script>

<!-- {#snippet render(args: LinkItemProps)}
  <LinkItem {...args} />
{/snippet} -->

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default">LinkItem</Story>

<Story
  name="With Props"
  args={{
    class: "custom-class",
    id: "unique-id",
    style: "background-color: tomato; padding: 10px; color: white;",
  }}
>
  LinkItem with props
</Story>
