/**
 * Calculates the dynamic number of rows for a textarea based on its content.
 *
 * @returns The calculated number of rows.
 */
export function calculateDynamicRows(
  textarea: HTMLTextAreaElement,
  minRows: number,
  maxRows: number,
): number {
  const linesCount = countLinesToLimit(textarea, Math.max(minRows, maxRows));

  if (linesCount <= minRows) {
    return minRows;
  } else if (linesCount <= maxRows) {
    return linesCount;
  } else {
    return maxRows;
  }
}

/**
 * Counts the number of lines in a textarea's content up to a specified limit.
 *
 * @returns  The total number of lines counted or the limit, whichever is smaller.
 */
function countLinesToLimit(
  textarea: HTMLTextAreaElement,
  limit: number,
): number {
  let totalLines = 1;
  for (const char of textarea.value) {
    if (char === "\n") {
      totalLines++;
    }
    if (totalLines > limit) {
      break;
    }
  }
  return totalLines;
}
