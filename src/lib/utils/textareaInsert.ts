let canInsertText: boolean | null = null;

export type InsertTextOptions = {
  selectionStart?: number;
  selectionEnd?: number;
};

export function textareaInsert(
  textarea: HTMLTextAreaElement,
  text: string,
  options?: InsertTextOptions,
) {
  const { selectionStart, selectionEnd } = options || {};
  const originalSelectionStart = textarea.selectionStart;
  const before = textarea.value.slice(0, originalSelectionStart);
  const after = textarea.value.slice(textarea.selectionEnd);

  if (canInsertText === null || canInsertText === true) {
    textarea.contentEditable = "true";
    try {
      canInsertText = document.execCommand("insertText", false, text);
    } catch {
      canInsertText = false;
    }
    textarea.contentEditable = "false";
  }

  if (
    canInsertText &&
    !textarea.value.slice(0, textarea.selectionStart).endsWith(text)
  ) {
    canInsertText = false;
  }

  if (!canInsertText) {
    try {
      document.execCommand("ms-beginUndoUnit");
    } catch {
      // do nothing
    }
    textarea.value = before + text + after;
    try {
      document.execCommand("ms-endUndoUnit");
    } catch {
      // do nothing
    }
    textarea.dispatchEvent(
      new CustomEvent("input", { bubbles: true, cancelable: true }),
    );
  }
  if (selectionStart != null && selectionEnd != null) {
    textarea.setSelectionRange(selectionStart, selectionEnd);
  } else {
    textarea.setSelectionRange(originalSelectionStart, textarea.selectionEnd);
  }
}
