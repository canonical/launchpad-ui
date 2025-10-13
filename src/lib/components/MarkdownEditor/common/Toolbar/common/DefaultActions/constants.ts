import {
  expandSelection,
  insertHeader,
  insertLink,
  toggleBold,
  toggleBulletList,
  toggleCode,
  toggleItalic,
  toggleNumberedList,
  toggleQuote,
  toggleTaskList,
} from "markdown-actions";
import type { ShortcutMetadata } from "$lib/shortcuts/index.js";
import { Shortcut } from "$lib/shortcuts/index.js";
import { isEventTargetInElement } from "$lib/utils/isEventTargetInElement.js";

export function createDefaultActions(
  getTextarea: () => HTMLTextAreaElement | undefined,
) {
  const predicate = (event: KeyboardEvent) =>
    isEventTargetInElement(event.target, getTextarea());

  const toggleHeader = (level: number) => () => {
    const textarea = getTextarea();
    if (!textarea) return;
    insertHeader(textarea, level, true);
  };

  const clearHeader = () => () => {
    const textarea = getTextarea();
    if (!textarea) return;
    expandSelection(textarea, { toLine: true });
    const text = textarea.value.slice(
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    const cleanedText = text.replace(/^#+\s*/, "");
    textarea.value =
      textarea.value.slice(0, textarea.selectionStart) +
      cleanedText +
      textarea.value.slice(textarea.selectionEnd);
    textarea.selectionStart = textarea.selectionEnd =
      textarea.selectionStart + cleanedText.length;
  };

  const insertCodeBlock = () => {
    const textarea = getTextarea();
    if (!textarea) return;
    document.execCommand("insertText", false, "```\n\n```");
  };

  const actionHandler =
    (action: (textarea: HTMLTextAreaElement) => void) => () => {
      const textarea = getTextarea();
      if (!textarea) return;
      action(textarea);
    };

  const metadata: Partial<ShortcutMetadata> = {
    category: "Editor",
  };

  return {
    h0: new Shortcut(
      "ctrl+alt+0",
      { ...metadata, label: "Apply normal text style" },
      clearHeader,
      {
        predicate,
      },
    ),

    h1: new Shortcut(
      "ctrl+alt+1",
      { ...metadata, label: "Apply Heading 1 style", description: "# Text" },
      toggleHeader(1),
      {
        predicate,
      },
    ),
    h2: new Shortcut(
      "ctrl+alt+2",
      { ...metadata, label: "Apply Heading 2 style", description: "## Text" },
      toggleHeader(2),
      {
        predicate,
      },
    ),
    h3: new Shortcut(
      "ctrl+alt+3",
      { ...metadata, label: "Apply Heading 3 style", description: "### Text" },
      toggleHeader(3),
      {
        predicate,
      },
    ),
    h4: new Shortcut(
      "ctrl+alt+4",
      { ...metadata, label: "Apply Heading 4 style", description: "#### Text" },
      toggleHeader(4),
      {
        predicate,
      },
    ),
    h5: new Shortcut(
      "ctrl+alt+5",
      {
        ...metadata,
        label: "Apply Heading 5 style",
        description: "##### Text",
      },
      toggleHeader(5),
      {
        predicate,
      },
    ),
    h6: new Shortcut(
      "ctrl+alt+6",
      {
        ...metadata,
        label: "Apply Heading 6 style",
        description: "###### Text",
      },
      toggleHeader(6),
      {
        predicate,
      },
    ),
    bold: new Shortcut(
      "ctrl+b",
      { ...metadata, label: "Bold", description: "**Text** or __Text__" },
      actionHandler(toggleBold),
      {
        predicate,
      },
    ),
    italic: new Shortcut(
      "ctrl+i",
      { ...metadata, label: "Italic", description: "*Text* or _Text_" },
      actionHandler(toggleItalic),
      {
        predicate,
      },
    ),
    quote: new Shortcut(
      "ctrl+shift+0",
      { ...metadata, label: "Quote", description: "> Text" },
      actionHandler(toggleQuote),
      {
        predicate,
      },
    ),
    code: new Shortcut(
      "ctrl+e",
      { ...metadata, label: "Code", description: "`code`" },
      actionHandler(toggleCode),
      {
        predicate,
      },
    ),
    codeBlock: new Shortcut(
      "ctrl+shift+e",
      { ...metadata, label: "Code Block", description: "```\ncode\n```" },
      actionHandler(insertCodeBlock),
      { predicate },
    ),
    insertLink: new Shortcut(
      "ctrl+k",
      {
        ...metadata,
        label: "Insert Link",
        description: "[Link text](https://ubuntu.com)",
      },
      actionHandler(insertLink),
      { predicate },
    ),
    unorderedList: new Shortcut(
      "ctrl+shift+8",
      {
        ...metadata,
        label: "Unordered List",
        description: "* List item\n* List item\n...",
      },
      actionHandler(toggleBulletList),
      { predicate },
    ),
    numberedList: new Shortcut(
      "ctrl+shift+7",
      {
        ...metadata,
        label: "Numbered List",
        description: "1. Text\n  - Text\n    - Text\n2. Text\n...",
      },
      actionHandler(toggleNumberedList),
      { predicate },
    ),
    taskList: new Shortcut(
      "ctrl+shift+9",
      {
        ...metadata,
        label: "Task List",
        description: "- [x] Completed task\n- [ ] Task\n- [ ] Task\n...",
      },
      actionHandler(toggleTaskList),
      { predicate },
    ),
  } satisfies Record<string, Shortcut>;
}
