type GetFirstElementOptions<T extends HTMLElement, U extends HTMLElement> = {
  /** The container element to search within */
  containerElement: T;
  /** Optional preferred child element to return if it exists in the container */
  preferredChild?: U;
  /** CSS selector string to find matching elements */
  selector: string;
  /** Optional predicate function to filter elements */
  predicate?: (element: U) => boolean;
};

/**
 * Gets the first available element from a container that matches the given selector.
 *
 * This function searches for elements within a container using a CSS selector.
 * It prioritizes a preferred child element if provided and contained within the container.
 * It skips disabled elements and applies an optional predicate filter.
 *
 * @returns The first matching element or null if none found
 *
 * @example
 * ```typescript
 * const container = document.getElementById('my-container');
 * const firstButton = getFirstElement({
 *   containerElement: container,
 *   selector: 'button',
 *   predicate: (btn) => !btn.classList.contains('hidden')
 * });
 * ```
 *
 * @example
 * ```typescript
 * const preferredBtn = document.getElementById('preferred-btn');
 * const result = getFirstElement({
 *   containerElement: container,
 *   preferredChild: preferredBtn,
 *   selector: 'button'
 * });
 * // Returns preferredBtn if it's in the container, otherwise first available button
 * ```
 */
export function getFirstElement<T extends HTMLElement, U extends HTMLElement>(
  options: GetFirstElementOptions<T, U>,
): U | null {
  const { containerElement, preferredChild, selector, predicate } = options;
  if (preferredChild && containerElement.contains(preferredChild)) {
    return preferredChild;
  }
  const items = Array.from(containerElement.querySelectorAll<U>(selector));
  if (items.length === 0) return null;

  for (const item of items) {
    if ("disabled" in item && item.disabled) continue;
    if (predicate && !predicate(item)) continue;
    return item;
  }

  return null;
}
