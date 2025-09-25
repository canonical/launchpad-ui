<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { MarkdownEditor } from "../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Toolbar",
    tags: ["autodocs"],
    component: MarkdownEditor.Toolbar,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar {...args} />
      </MarkdownEditor.Header>
    </MarkdownEditor>
  {/snippet}
</Story>
