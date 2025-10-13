type Line = {
  line: string;
  isCurrent: boolean;
};

function parseLines(textarea: HTMLTextAreaElement): Line[] {
  return textarea.value.split("\n").map((line, index) => ({
    line,
    isCurrent: index === getCurrentLineIndex(textarea),
  }));
}

function getCurrentLineIndex(textarea: HTMLTextAreaElement): number {
  const lines = textarea.value
    .substring(0, textarea.selectionStart)
    .split("\n");
  return lines.length - 1;
}

function applyListContinuation(
  textarea: HTMLTextAreaElement,
  lines: Line[],
): boolean {
  const listRegex = /^(\s*)([-*]|\d+\.)\s/; // matches "- ", "* ", "1. "
  const currentLine = lines.find((line) => line.isCurrent);
  const currentLineMatch = currentLine?.line.match(listRegex);
  if (!currentLineMatch || !currentLine) return false;

  const leadingWhitespace = currentLineMatch[1];
  const marker = currentLineMatch[2];
  const restOfLine = currentLine.line
    .substring(currentLineMatch[0].length)
    .trim();

  const isUnorderedList = marker === "-" || marker === "*";
  const isTodoList =
    isUnorderedList &&
    (restOfLine.startsWith("[ ]") || restOfLine.startsWith("[x]"));
  // if current line is empty, exit list block
  const listContentIsEmpty = restOfLine.length === 0;
  const todoListIsEmpty = isTodoList && restOfLine.length === 3;

  if (listContentIsEmpty || todoListIsEmpty) {
    const lineStart = textarea.selectionStart - currentLine.line.length;
    textarea.selectionEnd = textarea.selectionStart;
    textarea.selectionStart = lineStart;
    document.execCommand("insertText", false, "\n");
    return true;
  }

  if (isTodoList) {
    const toInsert = `\n${leadingWhitespace}- [ ] `;
    document.execCommand("insertText", false, toInsert);
    return true;
  } else if (isUnorderedList) {
    const toInsert = `\n${leadingWhitespace}${marker} `;
    document.execCommand("insertText", false, toInsert);
    return true;
  } else {
    const listIndex = parseInt(marker.replace(".", ""));
    if (isNaN(listIndex)) return false;
    const toInsert = `\n${leadingWhitespace}${listIndex + 1}. `;
    document.execCommand("insertText", false, toInsert);
    return true;
  }
}

function applyCodeBlockContinuation(
  textarea: HTMLTextAreaElement,
  lines: Line[],
): boolean {
  const currentLine = lines.find((line) => line.isCurrent);
  const codeBlockRegex = /^(\s*)```/;
  const currentLineMatch = currentLine?.line.match(codeBlockRegex);
  if (!currentLineMatch || !currentLine) return false;
  const originalSelectionStart = textarea.selectionStart;
  const leadingWhitespace = currentLineMatch[1];

  const totalCodeBlockLines = lines.filter((line) =>
    line.line.match(codeBlockRegex),
  ).length;
  // no missing code block closing line
  if (totalCodeBlockLines % 2 === 0) return false;
  const toInsert = `\n\n${leadingWhitespace}\`\`\``;
  document.execCommand("insertText", false, toInsert);
  textarea.setSelectionRange(
    originalSelectionStart + 1,
    originalSelectionStart + 1,
  );

  return true;
}

/**
 * @returns true if the auto completions were applied, false otherwise
 */
export function applyAutoCompletions(textarea: HTMLTextAreaElement): boolean {
  const lines = parseLines(textarea);

  const listApplied = applyListContinuation(textarea, lines);
  if (listApplied) return true;

  const codeBlockApplied = applyCodeBlockContinuation(textarea, lines);
  if (codeBlockApplied) return true;
  return false;
}
