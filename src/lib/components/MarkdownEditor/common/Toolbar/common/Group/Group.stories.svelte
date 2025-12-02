<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { BoldIcon } from "$lib/components/icons/index.js";
  import { MarkdownEditor } from "../../../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Toolbar/Group",
    tags: ["autodocs"],
    component: MarkdownEditor.Toolbar.Group,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.Group {...args}>
          <MarkdownEditor.Toolbar.ActionButton label="Bold">
            <BoldIcon />
          </MarkdownEditor.Toolbar.ActionButton>
        </MarkdownEditor.Toolbar.Group>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
