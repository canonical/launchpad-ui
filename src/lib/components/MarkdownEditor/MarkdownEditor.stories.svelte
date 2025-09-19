<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button, Checkbox, Icon } from "../index.js";
  import { MarkdownEditor } from "./index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor",
    tags: ["autodocs"],
    component: MarkdownEditor,
  });

  let value = $state("");
  let preview = $state(false);

  let textarea = $state<HTMLTextAreaElement>();
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <MarkdownEditor.Toolbar />
      <MarkdownEditor.Textarea placeholder="Start typing…" autofocus />
    </MarkdownEditor>
  {/snippet}
</Story>

<Story name="With preview">
  {#snippet template(args)}
    <!-- 
    <script lang="ts">
      let preview = $state(false);
      let value = $state("");
    </script>
    -->
    <MarkdownEditor {...args}>
      <MarkdownEditor.Toolbar>
        <label style="display: flex; align-items: center; gap: 8px;">
          <Checkbox bind:checked={preview} />
          Preview
        </label>
      </MarkdownEditor.Toolbar>
      {#if preview}
        <div>
          {#if value}
            {value}
          {:else}
            <em>No content</em>
          {/if}
        </div>
      {:else}
        <MarkdownEditor.Textarea bind:value placeholder="Start typing…" />
      {/if}
    </MarkdownEditor>
  {/snippet}
</Story>

<Story name="With additional actions">
  {#snippet template(args)}
    <!-- 
      <script lang="ts">
        let textarea = $state<HTMLTextAreaElement>();
      </script>
    -->
    <MarkdownEditor {...args}>
      <MarkdownEditor.Toolbar>
        {#snippet actions()}
          <MarkdownEditor.Toolbar.Separator />
          <MarkdownEditor.Toolbar.Group aria-label="Magic actions">
            <Button
              modifiers={{ density: "dense", severity: "base" }}
              onclick={() => {
                if (textarea) {
                  textarea.focus();
                  document.execCommand(
                    "insertText",
                    false,
                    "wow what happened?!",
                  );
                }
              }}
            >
              {#snippet iconLeft()}
                <Icon name="unstarred" />
              {/snippet}
            </Button>
          </MarkdownEditor.Toolbar.Group>

          <MarkdownEditor.Toolbar.Separator />
          <MarkdownEditor.Toolbar.Group aria-label="Git actions">
            <Button modifiers={{ density: "dense", severity: "base" }}>
              {#snippet iconLeft()}
                <Icon name="branch-merge" />
              {/snippet}
            </Button>
            <Button modifiers={{ density: "dense", severity: "base" }}>
              {#snippet iconLeft()}
                <Icon name="branch-merged" />
              {/snippet}
            </Button>
            <Button modifiers={{ density: "dense", severity: "base" }}>
              {#snippet iconLeft()}
                <Icon name="fork" />
              {/snippet}
            </Button>
          </MarkdownEditor.Toolbar.Group>
        {/snippet}
      </MarkdownEditor.Toolbar>
      <MarkdownEditor.Textarea
        bind:ref={textarea}
        placeholder="Start typing…"
      />
    </MarkdownEditor>
  {/snippet}
</Story>
