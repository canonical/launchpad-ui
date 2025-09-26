export type GetSiblingElementOptions<
  T extends HTMLElement,
  U extends HTMLElement,
> = {
  /**
   * The container element.
   */
  containerElement: T;
  /**
   * The current element.
   */
  currentElement: U;
  /**
   * A CSS selector used to collect the navigable items within `containerElement`.
   */
  selector: string;
  /**
   * The direction to navigate ('next' or 'previous').
   */
  direction: "next" | "previous";
  /**
   * Whether to wrap around when reaching the beginning or end of the list.
   *
   * When `true`, navigation continues from the end to the beginning (or
   * vice versa);
   * when `false`, navigation stops at the boundary and returns `null`
   * if no eligible sibling exists in the chosen direction.
   */
  wrap: boolean;
  /**
   * A predicate to filter the elements.
   *
   * This function already checks if the element is disabled.
   */
  predicate?: (element: U) => boolean;
};

/**
 * Returns the first eligible sibling element of `currentElement`
 * in the given `direction`.
 * 

 * Returns `null` when no selector can be determined, no candidates
 * are found, the current element is not part of the candidate list,
 * or no eligible sibling exists in the requested direction.
 *
 * @returns The next eligible sibling element, or `null` when none is found.
 */
export function getSiblingElement<T extends HTMLElement, U extends HTMLElement>(
  options: GetSiblingElementOptions<T, U>,
): U | null {
  const {
    containerElement,
    currentElement,
    selector,
    direction,
    wrap,
    predicate,
  } = options;

  const items = Array.from(containerElement.querySelectorAll<U>(selector));
  if (items.length === 0) return null;

  const currentIndex = items.indexOf(currentElement);
  if (currentIndex === -1) return null;

  const directionModifier = direction === "next" ? 1 : -1;
  const maxRange = wrap
    ? items.length
    : Math.abs(currentIndex - (direction === "next" ? items.length : -1));
  for (let i = 1; i < maxRange; i++) {
    const index = (currentIndex + i * directionModifier) % items.length;
    const action = items.at(index);
    if (!action) continue;
    if ("disabled" in action && action.disabled) continue;
    if (predicate && !predicate(action)) continue;

    return action;
  }

  return null;
}
