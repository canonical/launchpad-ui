/**
 * Determines the sibling toolbar action (<button>) to focus when navigating
 * with ArrowLeft/ArrowRight within a toolbar.
 *
 * @param toolbarElement - The toolbar container element.
 * @param event - The keyboard event that triggered navigation.
 * @returns The sibling HTMLButtonElement to focus, or null if none is available.
 */
export function getSiblingActionElement(
  toolbarElement: HTMLDivElement,
  event: KeyboardEvent,
): HTMLButtonElement | null {
  const actions = Array.from(
    toolbarElement.querySelectorAll<HTMLButtonElement>("button"),
  );

  if (actions.length === 0) return null;

  const direction = event.key === "ArrowLeft" ? "previous" : "next";
  const fallback =
    (direction === "next" ? actions.at(0) : actions.at(-1)) || null;

  if (!event.target || !(event.target instanceof HTMLButtonElement)) {
    return null;
  }
  const eventTarget = event.target as HTMLButtonElement;
  const currentAction = actions.findIndex((action) => action === eventTarget);

  // Last selected action for any reason no longer exists
  if (currentAction === -1) return fallback;

  const nextIndex =
    direction === "next"
      ? (currentAction + 1) % actions.length
      : currentAction - 1;

  return actions.at(nextIndex) || null;
}
