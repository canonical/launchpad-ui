<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/internal/test";
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
        control: "text",
        table: {
          type: {
            summary: "string",
          },
        },
      },
      ...modifiersControl(buttonModifiers),
    },
  });
</script>

<Story name="Default">
  {#snippet template({ label, children, ...args })}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.ActionButton
          label={label || "Bold"}
          callback={() => fn()}
          {...args}
        >
          {#if children}
            {@render children()}
          {:else}
            <Icon name="bold" />
          {/if}
        </MarkdownEditor.Toolbar.ActionButton>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
