<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/index.js";
  import { MarkdownEditor } from "../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Controls",
    tags: ["autodocs"],
    component: MarkdownEditor.Controls,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Header {...args}>
        <MarkdownEditor.Toolbar />
        <MarkdownEditor.Controls>
          <Button>Preview</Button>
        </MarkdownEditor.Controls>
      </MarkdownEditor.Header>
    </MarkdownEditor>
  {/snippet}
</Story>
