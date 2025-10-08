import { Shortcut } from "$lib/shortcuts/index.js";
import { isEventTargetInElement } from "$lib/utils/isEventTargetInElement.js";

// TODO: replace these dummy functions with panphora/markdown-actions
const insertTextCb =
  (getTextarea: () => HTMLTextAreaElement | undefined, text: string) => () => {
    getTextarea()?.focus();
    document.execCommand("insertText", false, text);
  };

export function createDefaultShortcuts(
  getTextarea: () => HTMLTextAreaElement | undefined,
) {
  const predicate = (event: KeyboardEvent) =>
    isEventTargetInElement(event.target, getTextarea());

  return {
    h1: new Shortcut(
      "ctrl+alt+1",
      "Heading 1",
      insertTextCb(getTextarea, "# "),
      { predicate },
    ),
    h2: new Shortcut(
      "ctrl+alt+2",
      "Heading 2",
      insertTextCb(getTextarea, "## "),
      { predicate },
    ),
    h3: new Shortcut(
      "ctrl+alt+3",
      "Heading 3",
      insertTextCb(getTextarea, "### "),
      { predicate },
    ),
    h4: new Shortcut(
      "ctrl+alt+4",
      "Heading 4",
      insertTextCb(getTextarea, "#### "),
      { predicate },
    ),
    h5: new Shortcut(
      "ctrl+alt+5",
      "Heading 5",
      insertTextCb(getTextarea, "##### "),
      { predicate },
    ),
    h6: new Shortcut(
      "ctrl+alt+6",
      "Heading 6",
      insertTextCb(getTextarea, "###### "),
      { predicate },
    ),
    bold: new Shortcut("ctrl+b", "Bold", insertTextCb(getTextarea, "**"), {
      predicate,
    }),
    italic: new Shortcut("ctrl+i", "Italic", insertTextCb(getTextarea, "*"), {
      predicate,
    }),
    quote: new Shortcut(
      "ctrl+shift+0",
      "Quote",
      insertTextCb(getTextarea, "> "),
      { predicate },
    ),
    code: new Shortcut("ctrl+e", "Code", insertTextCb(getTextarea, "`"), {
      predicate,
    }),
    insertLink: new Shortcut(
      "ctrl+k",
      "Insert Link",
      insertTextCb(getTextarea, "["),
      { predicate },
    ),
    unorderedList: new Shortcut(
      "ctrl+shift+8",
      "Unordered List",
      insertTextCb(getTextarea, "- "),
      { predicate },
    ),
    numberedList: new Shortcut(
      "ctrl+shift+7",
      "Numbered List",
      insertTextCb(getTextarea, "1. "),
      { predicate },
    ),
    taskList: new Shortcut(
      "ctrl+shift+9",
      "Task List",
      insertTextCb(getTextarea, "- [ ] "),
      { predicate },
    ),
  };
}
