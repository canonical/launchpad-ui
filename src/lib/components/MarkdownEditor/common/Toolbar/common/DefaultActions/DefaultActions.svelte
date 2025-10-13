<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import ShortcutsHelpSidePanel from "$lib/components/ShortcutsHelpSidePanel/ShortcutsHelpSidePanel.svelte";
  import type { ShortcutsHelpSidePanelMethods } from "$lib/components/ShortcutsHelpSidePanel/types.js";
  import { Shortcut, useShortcuts } from "$lib/shortcuts";
  import { getMarkdownEditorContext } from "../../../../context.js";
  import { ActionButton } from "../ActionButton";
  import Group from "../Group/Group.svelte";
  import { createDefaultActions } from "./constants";

  const markdownEditorContext = getMarkdownEditorContext();
  const textareaElement = $derived(markdownEditorContext?.textareaElement);
  const defaultShortcuts = createDefaultActions(() => textareaElement);

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
    ...Object.values(defaultShortcuts).map((shortcut) => shortcut),
  ]);
</script>

<Group aria-label="Inline elements">
  <ActionButton
    onclick={() => defaultShortcuts.h1.callback()}
    shortcut={defaultShortcuts.h1}
    label="Add heading 1"
  >
    <Icon name="heading" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.bold.callback()}
    shortcut={defaultShortcuts.bold}
    label="Add bold"
  >
    <Icon name="bold" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.italic.callback()}
    shortcut={defaultShortcuts.italic}
    label="Add italic"
  >
    <Icon name="italic" />
  </ActionButton>
</Group>
<Group aria-label="Block elements">
  <ActionButton
    onclick={() => defaultShortcuts.quote.callback()}
    shortcut={defaultShortcuts.quote}
    label="Add quote"
  >
    <Icon name="quote" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.code.callback()}
    shortcut={defaultShortcuts.code}
    label="Add code"
  >
    <Icon name="code" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.insertLink.callback()}
    shortcut={defaultShortcuts.insertLink}
    label="Add link"
  >
    <Icon name="get-link" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.unorderedList.callback()}
    shortcut={defaultShortcuts.unorderedList}
    label="Add bullet list"
  >
    <Icon name="bulleted-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.numberedList.callback()}
    shortcut={defaultShortcuts.numberedList}
    label="Add numbered list"
  >
    <Icon name="numbered-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.numberedList.callback()}
    shortcut={defaultShortcuts.numberedList}
    label="Add numbered list"
  >
    <Icon name="numbered-list" />
  </ActionButton>
  <ActionButton
    onclick={() => defaultShortcuts.taskList.callback()}
    shortcut={defaultShortcuts.taskList}
    label="Add task list"
  >
    <Icon name="task-list" />
  </ActionButton>
</Group>
<Group aria-label="Miscellaneous">
  <ActionButton
    onclick={() => handleShowHelp()}
    shortcut={helpShortcut}
    label="Help"
  >
    <Icon name="help" />
  </ActionButton>
  <ShortcutsHelpSidePanel
    bind:this={modalMethods}
    onclose={() => handleCloseHelp()}
  />
</Group>
