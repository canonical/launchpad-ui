<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { MarkdownEditor } from "../../index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor/Textarea",
    tags: ["autodocs"],
    component: MarkdownEditor.Textarea,
    argTypes: {
      ref: {
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
      <MarkdownEditor.Header>
        <MarkdownEditor.Textarea {...args} />
      </MarkdownEditor.Header>
    </MarkdownEditor>
  {/snippet}
</Story>
