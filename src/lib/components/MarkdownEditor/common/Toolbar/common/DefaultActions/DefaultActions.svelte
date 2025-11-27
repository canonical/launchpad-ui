<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Help, Link } from "@canonical/svelte-icons";
  import ShortcutsHelpSidePanel from "$lib/components/ShortcutsHelpSidePanel/ShortcutsHelpSidePanel.svelte";
  import type { ShortcutsHelpSidePanelMethods } from "$lib/components/ShortcutsHelpSidePanel/types.js";
  import {
    Bold,
    BulletedList,
    CodeTag,
    Heading,
    Italic,
    NumberedList,
    Quote,
    TaskList,
  } from "$lib/components/icons/index.js";
  import { Shortcut, useShortcuts } from "$lib/shortcuts";
  import { getMarkdownEditorContext } from "../../../../context.js";
  import { ActionButton } from "../ActionButton";
  import Group from "../Group/Group.svelte";
  import { createDefaultActions } from "./constants";

  const markdownEditorContext = getMarkdownEditorContext();
  const textareaElement = $derived(markdownEditorContext?.textareaElement);
  const defaultActions = createDefaultActions(() => textareaElement);

  let modalMethods = $state<ShortcutsHelpSidePanelMethods>();
  let textareaSelectionBeforeHelp = $state<{
    textareaElement: HTMLTextAreaElement;
    selectionStart: number;
    selectionEnd: number;
  }>();

  const handleShowHelp = () => {
    if (textareaElement && document.activeElement === textareaElement) {
      textareaSelectionBeforeHelp = {
        textareaElement,
        selectionStart: textareaElement.selectionStart ?? 0,
        selectionEnd: textareaElement.selectionEnd ?? 0,
      };
    } else {
      textareaSelectionBeforeHelp = undefined;
    }
    modalMethods?.showModal();
  };

  const handleCloseHelp = () => {
    if (
      textareaSelectionBeforeHelp &&
      // if the textarea element is the same as the one before the help was shown
      textareaElement === textareaSelectionBeforeHelp.textareaElement
    ) {
      textareaElement.setSelectionRange(
        textareaSelectionBeforeHelp.selectionStart,
        textareaSelectionBeforeHelp.selectionEnd,
      );
      textareaElement?.focus();
      textareaSelectionBeforeHelp = undefined;
    }
  };

  const helpShortcut = new Shortcut(
    "ctrl+/",
    {
      label: "Open command guide",
    },
    () => {
      handleShowHelp();
    },
  );

  useShortcuts(() => [
    helpShortcut,
    ...Object.values(defaultActions).map((action) => action.shortcut),
  ]);
</script>

<Group aria-label="Inline elements">
  <ActionButton
    onclick={() => defaultActions.h1.action()}
    shortcut={defaultActions.h1.shortcut}
    label="Add heading 1"
  >
    <Heading />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.bold.action()}
    shortcut={defaultActions.bold.shortcut}
    label="Add bold"
  >
    <Bold />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.italic.action()}
    shortcut={defaultActions.italic.shortcut}
    label="Add italic"
  >
    <Italic />
  </ActionButton>
</Group>
<Group aria-label="Block elements">
  <ActionButton
    onclick={() => defaultActions.quote.action()}
    shortcut={defaultActions.quote.shortcut}
    label="Add quote"
  >
    <Quote />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.code.action()}
    shortcut={defaultActions.code.shortcut}
    label="Add code"
  >
    <CodeTag />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.insertLink.action()}
    shortcut={defaultActions.insertLink.shortcut}
    label="Add link"
  >
    <Link />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.unorderedList.action()}
    shortcut={defaultActions.unorderedList.shortcut}
    label="Add bullet list"
  >
    <BulletedList />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.numberedList.action()}
    shortcut={defaultActions.numberedList.shortcut}
    label="Add numbered list"
  >
    <NumberedList />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.numberedList.action()}
    shortcut={defaultActions.numberedList.shortcut}
    label="Add numbered list"
  >
    <NumberedList />
  </ActionButton>
  <ActionButton
    onclick={() => defaultActions.taskList.action()}
    shortcut={defaultActions.taskList.shortcut}
    label="Add task list"
  >
    <TaskList />
  </ActionButton>
</Group>
<Group aria-label="Miscellaneous">
  <ActionButton
    onclick={() => handleShowHelp()}
    shortcut={helpShortcut}
    label="Help"
  >
    <Help />
  </ActionButton>
  <ShortcutsHelpSidePanel
    bind:this={modalMethods}
    onclose={() => handleCloseHelp()}
  />
</Group>
