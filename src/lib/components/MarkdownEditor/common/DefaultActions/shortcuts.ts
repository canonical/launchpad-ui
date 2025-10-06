import { Shortcut } from "$lib/shortcut";

// TODO: replace these dummy functions with panphora/markdown-actions
const insertTextCb = (text: string) => (textarea: HTMLTextAreaElement) => {
  textarea.focus();
  document.execCommand("insertText", false, text);
};

export const DEFAULT_SHORTCUTS = {
  h1: new Shortcut("ctrl+alt+1", "Heading 1", insertTextCb("# ")),
  h2: new Shortcut("ctrl+alt+2", "Heading 2", insertTextCb("## ")),
  h3: new Shortcut("ctrl+alt+3", "Heading 3", insertTextCb("### ")),
  h4: new Shortcut("ctrl+alt+4", "Heading 4", insertTextCb("#### ")),
  h5: new Shortcut("ctrl+alt+5", "Heading 5", insertTextCb("##### ")),
  h6: new Shortcut("ctrl+alt+6", "Heading 6", insertTextCb("###### ")),
  bold: new Shortcut("ctrl+b", "Bold", insertTextCb("**")),
  italic: new Shortcut("ctrl+i", "Italic", insertTextCb("*")),
  quote: new Shortcut("ctrl+shift+0", "Quote", insertTextCb("> ")),
  code: new Shortcut("ctrl+e", "Code", insertTextCb("`")),
  insertLink: new Shortcut("ctrl+k", "Insert Link", insertTextCb("[")),
  unorderedList: new Shortcut(
    "ctrl+shift+8",
    "Unordered List",
    insertTextCb("- "),
  ),
  numberedList: new Shortcut(
    "ctrl+shift+7",
    "Numbered List",
    insertTextCb("1. "),
  ),
  taskList: new Shortcut("ctrl+shift+9", "Task List", insertTextCb("- [ ] ")),
} as const satisfies {
  [key: string]: Shortcut<HTMLTextAreaElement>;
};
