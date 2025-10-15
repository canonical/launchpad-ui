<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { buttonModifiers } from "$lib/components/Button/modifiers/index.js";
  import { Icon } from "$lib/components/index.js";
  import { modifiersControl } from "$lib/modifiers/storybook.js";
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
      ...modifiersControl(buttonModifiers),
    },
  });
</script>

<Story name="Default" args={{ label: "Bold" }}>
  {#snippet template({ children: _, ...args })}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.ActionButton {...args}>
          <Icon name="bold" />
        </MarkdownEditor.Toolbar.ActionButton>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
