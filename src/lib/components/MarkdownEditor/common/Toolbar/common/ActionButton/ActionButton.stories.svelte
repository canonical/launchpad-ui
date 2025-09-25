<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/index.js";
  import { MarkdownEditor } from "../../../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Toolbar/ActionButton",
    tags: ["autodocs"],
    component: MarkdownEditor.Toolbar.ActionButton,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Toolbar>
        <MarkdownEditor.Toolbar.ActionButton {...args}>
          {#snippet iconLeft()}
            <Icon name="bold" />
          {/snippet}
        </MarkdownEditor.Toolbar.ActionButton>
      </MarkdownEditor.Toolbar>
    </MarkdownEditor>
  {/snippet}
</Story>
