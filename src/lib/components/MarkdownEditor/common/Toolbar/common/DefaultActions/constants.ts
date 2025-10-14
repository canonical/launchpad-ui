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

  const h1 = toggleHeader(1);
  const h2 = toggleHeader(2);
  const h3 = toggleHeader(3);
  const h4 = toggleHeader(4);
  const h5 = toggleHeader(5);
  const h6 = toggleHeader(6);
  const bold = actionHandler(toggleBold);
  const italic = actionHandler(toggleItalic);
  const quote = actionHandler(toggleQuote);
  const code = actionHandler(toggleCode);
  const link = actionHandler(insertLink);
  const unorderedList = actionHandler(toggleBulletList);
  const numberedList = actionHandler(toggleNumberedList);
  const taskList = actionHandler(toggleTaskList);

  return {
    h0: {
      action: clearHeader,
      shortcut: new Shortcut(
        "ctrl+alt+0",
        { ...metadata, label: "Apply normal text style" },
        clearHeader,
        {
          predicate,
        },
      ),
    },

    h1: {
      action: h1,
      shortcut: new Shortcut(
        "ctrl+alt+1",
        { ...metadata, label: "Apply Heading 1 style", description: "# Text" },
        h1,
        {
          predicate,
        },
      ),
    },
    h2: {
      action: h2,
      shortcut: new Shortcut(
        "ctrl+alt+2",
        { ...metadata, label: "Apply Heading 2 style", description: "## Text" },
        h2,
        {
          predicate,
        },
      ),
    },
    h3: {
      action: h3,
      shortcut: new Shortcut(
        "ctrl+alt+3",
        {
          ...metadata,
          label: "Apply Heading 3 style",
          description: "### Text",
        },
        h3,
        {
          predicate,
        },
      ),
    },
    h4: {
      action: h4,
      shortcut: new Shortcut(
        "ctrl+alt+4",
        {
          ...metadata,
          label: "Apply Heading 4 style",
          description: "#### Text",
        },
        h4,
        {
          predicate,
        },
      ),
    },
    h5: {
      action: h5,
      shortcut: new Shortcut(
        "ctrl+alt+5",
        {
          ...metadata,
          label: "Apply Heading 5 style",
          description: "##### Text",
        },
        h5,
        {
          predicate,
        },
      ),
    },
    h6: {
      action: h6,
      shortcut: new Shortcut(
        "ctrl+alt+6",
        {
          ...metadata,
          label: "Apply Heading 6 style",
          description: "###### Text",
        },
        h6,
        {
          predicate,
        },
      ),
    },
    bold: {
      action: bold,
      shortcut: new Shortcut(
        "ctrl+b",
        { ...metadata, label: "Bold", description: "**Text** or __Text__" },
        bold,
        {
          predicate,
        },
      ),
    },
    italic: {
      action: italic,
      shortcut: new Shortcut(
        "ctrl+i",
        { ...metadata, label: "Italic", description: "*Text* or _Text_" },
        italic,
        {
          predicate,
        },
      ),
    },
    quote: {
      action: quote,
      shortcut: new Shortcut(
        "ctrl+shift+0",
        { ...metadata, label: "Quote", description: "> Text" },
        quote,
        {
          predicate,
        },
      ),
    },
    code: {
      action: code,
      shortcut: new Shortcut(
        "ctrl+e",
        { ...metadata, label: "Code", description: "`code`" },
        code,
        {
          predicate,
        },
      ),
    },
    codeBlock: {
      action: insertCodeBlock,
      shortcut: new Shortcut(
        "ctrl+shift+e",
        { ...metadata, label: "Code Block", description: "```\ncode\n```" },
        insertCodeBlock,
        { predicate },
      ),
    },
    insertLink: {
      action: link,
      shortcut: new Shortcut(
        "ctrl+k",
        {
          ...metadata,
          label: "Insert Link",
          description: "[Link text](https://ubuntu.com)",
        },
        link,
        { predicate },
      ),
    },
    unorderedList: {
      action: unorderedList,
      shortcut: new Shortcut(
        "ctrl+shift+8",
        {
          ...metadata,
          label: "Unordered List",
          description: "* List item\n* List item\n...",
        },
        unorderedList,
        { predicate },
      ),
    },
    numberedList: {
      action: numberedList,
      shortcut: new Shortcut(
        "ctrl+shift+7",
        {
          ...metadata,
          label: "Numbered List",
          description: "1. Text\n  - Text\n    - Text\n2. Text\n...",
        },
        numberedList,
        { predicate },
      ),
    },
    taskList: {
      action: taskList,
      shortcut: new Shortcut(
        "ctrl+shift+9",
        {
          ...metadata,
          label: "Task List",
          description: "- [x] Completed task\n- [ ] Task\n- [ ] Task\n...",
        },
        taskList,
        { predicate },
      ),
    },
  } satisfies Record<string, { action: () => void; shortcut: Shortcut }>;
}
