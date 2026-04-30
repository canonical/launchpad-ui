type GetLastElementOptions<T, U extends HTMLElement> = {
  /** The container element to search within */
  containerElement: U;
  /** CSS selector string to find matching elements */
  selector: string;
  /** Optional predicate function to filter elements */
  predicate?: (element: T) => boolean;
};

/**
 * Gets the last available element from a container that matches the given selector.
 *
 * This function searches for elements within a container using a CSS selector.
 * It applies an optional predicate filter to further refine the selection,
 * iterating from the end so the last eligible match is returned.
 *
 * @example
 * ```typescript
 * const container = document.getElementById('my-container');
 * const lastButton = getLastElement({
 *   containerElement: container,
 *   selector: 'button',
 *   predicate: (btn) => !btn.classList.contains('hidden')
 * });
 * ```
 */
export function getLastElement<T, U extends HTMLElement = HTMLElement>(
  options: GetLastElementOptions<T, U>,
): T | null {
  const { containerElement, selector, predicate } = options;
  const items = Array.from(containerElement.querySelectorAll(selector)) as T[];

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (predicate && !predicate(item)) continue;
    return item;
  }

  return null;
}
