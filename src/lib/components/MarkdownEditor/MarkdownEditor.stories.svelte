<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button, Checkbox, Icon } from "../index.js";
  import { MarkdownEditor } from "./index.js";

  const { Story } = defineMeta({
    title: "components/MarkdownEditor",
    tags: ["autodocs"],
    component: MarkdownEditor,
  });

  let textarea = $state<HTMLTextAreaElement>();
  // with preview
  let value = $state("");
  let preview = $state(false);

  // with additional actions
  const insertText = (text: string) => {
    if (textarea) {
      textarea.focus();
      document.execCommand("insertText", false, text);
    }
  };

  // dynamic toolbar actions injection
  let hideExistingActions = $state(false);
  let showNewActions = $state(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startCountdown = async () => {
    await sleep(1000);
    hideExistingActions = true;
    await sleep(1000);
    showNewActions = true;
  };

  // dynamic toolbar actions disabled
  let disableDynamicActions = $state(false);
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar />
      </MarkdownEditor.Header>
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
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar />
        <MarkdownEditor.Controls>
          <label style="display: flex; align-items: center; gap: 8px;">
            <Checkbox bind:checked={preview} />
            Preview
          </label>
        </MarkdownEditor.Controls>
      </MarkdownEditor.Header>
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
        const insertText = (text: string) => {
          if (textarea) {
            textarea.focus();
            document.execCommand("insertText", false, text);
          }
        };
      </script>
    -->
    <MarkdownEditor {...args}>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar>
          <MarkdownEditor.Toolbar.Group aria-label="Magic actions">
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("wow what happened?!")}
            >
              {#snippet iconLeft()}
                <Icon name="unstarred" />
              {/snippet}
            </MarkdownEditor.Toolbar.ActionButton>
          </MarkdownEditor.Toolbar.Group>

          <MarkdownEditor.Toolbar.Group aria-label="Git actions">
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("merge branch")}
            >
              {#snippet iconLeft()}
                <Icon name="branch-merge" />
              {/snippet}
            </MarkdownEditor.Toolbar.ActionButton>
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("branch merged")}
            >
              {#snippet iconLeft()}
                <Icon name="branch-merged" />
              {/snippet}
            </MarkdownEditor.Toolbar.ActionButton>
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("fork repository")}
            >
              {#snippet iconLeft()}
                <Icon name="fork" />
              {/snippet}
            </MarkdownEditor.Toolbar.ActionButton>
          </MarkdownEditor.Toolbar.Group>
        </MarkdownEditor.Toolbar>
      </MarkdownEditor.Header>
      <MarkdownEditor.Textarea
        bind:ref={textarea}
        placeholder="Start typing…"
      />
    </MarkdownEditor>
  {/snippet}
</Story>

<Story name="Dynamic toolbar actions injection" tags={["!autodocs"]}>
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar>
          {#if !hideExistingActions}
            <MarkdownEditor.Toolbar.Group aria-label="Dynamic actions">
              <MarkdownEditor.Toolbar.ActionButton>
                {#snippet iconLeft()}
                  <Icon name="revisions" />
                {/snippet}
              </MarkdownEditor.Toolbar.ActionButton>
            </MarkdownEditor.Toolbar.Group>
          {/if}
          {#if showNewActions}
            <MarkdownEditor.Toolbar.Group aria-label="Dynamic actions">
              <MarkdownEditor.Toolbar.ActionButton>
                {#snippet iconLeft()}
                  <Icon name="select-add" />
                {/snippet}
              </MarkdownEditor.Toolbar.ActionButton>
            </MarkdownEditor.Toolbar.Group>
          {/if}
        </MarkdownEditor.Toolbar>
        <MarkdownEditor.Controls>
          <Button
            onclick={startCountdown}
            loading={hideExistingActions !== showNewActions}
          >
            {#if !hideExistingActions && !showNewActions}
              Start countdown
            {:else if hideExistingActions !== showNewActions}
              In progress...
            {:else}
              Done
            {/if}
          </Button>
        </MarkdownEditor.Controls>
      </MarkdownEditor.Header>
      <MarkdownEditor.Textarea placeholder="Start typing…" />
    </MarkdownEditor>
  {/snippet}
</Story>

<Story name="Dynamic toolbar actions disabled" tags={["!autodocs"]}>
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar class="dynamic-disabled">
          <MarkdownEditor.Toolbar.Group aria-label="Dynamic actions">
            <MarkdownEditor.Toolbar.ActionButton
              disabled={disableDynamicActions}
            >
              {#snippet iconLeft()}
                <Icon name="revisions" />
              {/snippet}
            </MarkdownEditor.Toolbar.ActionButton>
          </MarkdownEditor.Toolbar.Group>
        </MarkdownEditor.Toolbar>
        <MarkdownEditor.Controls>
          <Button
            onclick={() => {
              disableDynamicActions = true;
            }}
            disabled={disableDynamicActions}
          >
            {#if disableDynamicActions}
              Done
            {:else}
              Disabled last action
            {/if}
          </Button>
        </MarkdownEditor.Controls>
      </MarkdownEditor.Header>
      <MarkdownEditor.Textarea placeholder="Start typing…" />
    </MarkdownEditor>
    <style>
      .dynamic-disabled
        .ds.markdown-editor-toolbar-action-button[tabindex="0"]:not(:disabled) {
        outline: 2px solid red;
        outline-offset: -2px;
      }
    </style>
  {/snippet}
</Story>
