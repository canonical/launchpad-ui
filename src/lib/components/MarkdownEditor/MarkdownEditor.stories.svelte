<script module lang="ts">
  import { Button, Switch } from "@canonical/svelte-ds-app-launchpad";
  import {
    ForkIcon,
    HelpIcon,
    RevisionsIcon,
    SelectAddIcon,
    StarredOffIcon,
  } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Component } from "svelte";
  import { ShortcutsHelpSidePanel } from "$lib/components/ShortcutsHelpSidePanel/index.js";
  import {
    BranchMergeIcon,
    BranchMergedIcon,
  } from "$lib/components/icons/index.js";
  import { Shortcut, UseShortcuts } from "$lib/shortcuts/index.js";
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

  // Focus management test
  type TestAction = {
    id: string;
    label: string;
    disabled: boolean;
    icon: Component;
  };

  const testShortcutCategory = "Focus test";
  const iconPool: Component[] = [
    RevisionsIcon,
    SelectAddIcon,
    ForkIcon,
    StarredOffIcon,
    BranchMergeIcon,
    BranchMergedIcon,
  ];

  let nextActionId = 1;
  function makeAction(): TestAction {
    const id = nextActionId++;
    return {
      id: `test-action-${id}`,
      label: `Action ${id}`,
      disabled: false,
      icon: iconPool[Math.floor(Math.random() * iconPool.length)],
    };
  }

  let actions = $state<TestAction[]>(Array.from({ length: 4 }, makeAction));
  let helpOpen = $state(false);

  function showHelp() {
    helpOpen = true;
  }

  function shuffleActions() {
    const shuffled = [...actions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    actions = shuffled;
  }

  function addAction() {
    actions.splice(
      Math.floor(Math.random() * (actions.length + 1)),
      0,
      makeAction(),
    );
  }

  function randomizeDisabled() {
    actions.forEach((action) => (action.disabled = Math.random() < 0.5));
  }

  function getFocusedAction() {
    const active = document.activeElement;
    const id = active instanceof HTMLElement ? active.id : "";
    return actions.find((action) => action.id === id);
  }

  function removeFocusedAction() {
    const action = getFocusedAction();
    if (!action) return;
    actions = actions.filter((a) => a.id !== action.id);
  }

  function toggleFocusedActionDisabled() {
    const action = getFocusedAction();
    if (!action) return;
    action.disabled = !action.disabled;
  }

  const testShortcuts = [
    new Shortcut(
      "alt+shift+s",
      { category: testShortcutCategory, label: "Shuffle action order" },
      (e) => {
        shuffleActions();
        e.preventDefault();
      },
    ),
    new Shortcut(
      "alt+shift+a",
      {
        category: testShortcutCategory,
        label: "Add an action at a random position",
      },
      (e) => {
        addAction();
        e.preventDefault();
      },
    ),
    new Shortcut(
      "alt+shift+d",
      {
        category: testShortcutCategory,
        label: "Randomize the disabled state of all actions",
      },
      (e) => {
        randomizeDisabled();
        e.preventDefault();
      },
    ),
    new Shortcut(
      "alt+shift+r",
      { category: testShortcutCategory, label: "Remove the focused action" },
      (e) => {
        removeFocusedAction();
        e.preventDefault();
      },
    ),
    new Shortcut(
      "alt+shift+x",
      {
        category: testShortcutCategory,
        label: "Toggle the focused action's disabled state",
      },
      (e) => {
        toggleFocusedActionDisabled();
        e.preventDefault();
      },
    ),
    new Shortcut("ctrl+/", { label: "Open shortcuts help" }, (e) => {
      showHelp();
      e.preventDefault();
    }),
  ];
</script>

<Story name="Default">
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar />
      </MarkdownEditor.Header>
      <MarkdownEditor.Textarea
        rows={[3, 9]}
        placeholder="Start typing…"
        autofocus
      />
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
        {#snippet controls()}
          <label style="display: flex; align-items: center; gap: 8px;">
            <Switch bind:checked={preview} />
            Preview
          </label>
        {/snippet}
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
              label="Magic"
              onclick={() => insertText("wow what happened?!")}
            >
              <StarredOffIcon />
            </MarkdownEditor.Toolbar.ActionButton>
          </MarkdownEditor.Toolbar.Group>

          <MarkdownEditor.Toolbar.Group aria-label="Git actions">
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("merge branch")}
              label="Merge"
            >
              <BranchMergeIcon />
            </MarkdownEditor.Toolbar.ActionButton>
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("branch merged")}
              label="Merged"
            >
              <BranchMergedIcon />
            </MarkdownEditor.Toolbar.ActionButton>
            <MarkdownEditor.Toolbar.ActionButton
              onclick={() => insertText("fork repository")}
              label="Fork"
            >
              <ForkIcon />
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

<Story name="Focus management test" tags={["!autodocs"]}>
  {#snippet template(args)}
    <MarkdownEditor {...args}>
      <ShortcutsHelpSidePanel bind:open={helpOpen} />
      <UseShortcuts shortcuts={testShortcuts} />
      <MarkdownEditor.Header>
        <MarkdownEditor.Toolbar data-test-no-default-actions>
          <MarkdownEditor.Toolbar.Group
            aria-label="Test actions"
            class="test-actions"
          >
            {#each actions as action (action.id)}
              {@const Icon = action.icon}
              <MarkdownEditor.Toolbar.ActionButton
                id={action.id}
                label={action.label}
                disabled={action.disabled}
              >
                <Icon />
              </MarkdownEditor.Toolbar.ActionButton>
            {/each}
          </MarkdownEditor.Toolbar.Group>
          <style>
            /* Show the action that is a tab stop */
            .test-actions {
              .ds.markdown-editor-toolbar-action-button[tabindex="0"] {
                box-shadow: inset 0 0 0 3px red;
              }
            }
          </style>
        </MarkdownEditor.Toolbar>
        {#snippet controls()}
          <div
            style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end;"
          >
            <Button density="compact" onclick={shuffleActions}>Shuffle</Button>
            <Button density="compact" onclick={addAction}>Add</Button>
            <Button density="compact" onclick={randomizeDisabled}
              >Randomize disabled</Button
            >
            <Button
              density="compact"
              severity="base"
              onclick={showHelp}
              aria-label="Open command guide"
            >
              {#snippet iconLeft()}
                <HelpIcon />
              {/snippet}
            </Button>
          </div>
        {/snippet}
      </MarkdownEditor.Header>
      <MarkdownEditor.Textarea
        value="Stress-tests the toolbar's roving-focus management: action buttons can be reordered, added, removed and disabled at any time, and the tab stop should always stay on a single enabled, mounted button."
      />
    </MarkdownEditor>
  {/snippet}
</Story>
