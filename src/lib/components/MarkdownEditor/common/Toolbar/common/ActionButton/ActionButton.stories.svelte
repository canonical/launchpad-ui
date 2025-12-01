<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Bold } from "$lib/components/icons/index.js";
  import { MarkdownEditor } from "../../../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Toolbar/ActionButton",
    tags: ["autodocs"],
    component: MarkdownEditor.Toolbar.ActionButton,
    argTypes: {
      ref: {
        table: {
          disable: true,
        },
      },
      disabled: {
        control: "boolean",
        description: "Whether the item is disabled.",
        table: {
          type: {
            summary: "boolean",
          },
        },
      },
      shortcut: {
        control: false,
      },
      children: {
        control: false,
      },
    },
  });
</script>

<Story name="Default" args={{ label: "Bold" }}>
  {#snippet template({ children: _, ...args })}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.ActionButton {...args}>
          <Bold />
        </MarkdownEditor.Toolbar.ActionButton>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
