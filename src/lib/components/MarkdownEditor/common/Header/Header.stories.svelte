<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/index.js";
  import { MarkdownEditor } from "../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Header",
    tags: ["autodocs"],
    component: MarkdownEditor.Header,
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor>
      <MarkdownEditor.Header {...args}>
        <MarkdownEditor.Toolbar />
        {#snippet controls()}
          <Button>Preview</Button>
        {/snippet}
      </MarkdownEditor.Header>
    </MarkdownEditor>
  {/snippet}
</Story>
