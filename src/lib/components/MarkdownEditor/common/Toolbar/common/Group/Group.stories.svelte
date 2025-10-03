<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/index.js";
  import { MarkdownEditor } from "../../../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Toolbar/Group",
    tags: ["autodocs"],
    component: MarkdownEditor.Toolbar.Group,
    argTypes: {
      containerWidth: {
        table: {
          disable: true,
        },
      },
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.Group {...args}>
          <MarkdownEditor.Toolbar.ActionButton label="Bold">
            <Icon name="bold" />
          </MarkdownEditor.Toolbar.ActionButton>
        </MarkdownEditor.Toolbar.Group>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
