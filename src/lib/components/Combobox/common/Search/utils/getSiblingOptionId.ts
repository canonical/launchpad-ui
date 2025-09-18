/**
 * Retrieves the ID of the sibling option in a combobox based on the current selection and `direction`.
 *
 * If no option is currently selected, returns:
 * - the first option's ID for 'next' direction
 * - the last option's ID for 'previous' direction
 *
 * @param listBoxElement - The listbox element containing the options.
 * @param currentOptionId - The ID of the currently selected option, or null if none is selected.
 * @param direction - The direction to navigate ('next' or 'previous').
 * @returns The ID of the sibling option, or null if no options exist.
 */
export function getSiblingOptionId(
  listBoxElement: HTMLElement,
  currentOptionId: string | null,
  direction: "next" | "previous",
): string | null {
  const options = Array.from(
    listBoxElement.querySelectorAll<HTMLElement>(".ds.combobox-option"),
  );

  if (options.length === 0) return null;

  const fallback =
    (direction === "next" ? options.at(0)?.id : options.at(-1)?.id) || null;

  // No option selected
  if (currentOptionId === null) return fallback;

  const currentIndex = options.findIndex(
    (option) => option.id === currentOptionId,
  );
  // Last selected option for any reason no longer exists
  if (currentIndex === -1) return fallback;

  const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0 || nextIndex >= options.length) {
    // According to WAI-ARIA Combobox Pattern, selection should not wrap
    // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#:~:text=of%20the%20combobox.-,Down%20Arrow,first%20option%2C%20either%20returns%20focus%20to%20the%20combobox%20or%20does%20nothing.,-Right%20Arrow
    return currentOptionId;
  }

  return options.at(nextIndex)?.id || null;
}
