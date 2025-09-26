type GetFirstElementOptions<T extends HTMLElement, U extends HTMLElement> = {
  /** The container element to search within */
  containerElement: T;
  /** CSS selector string to find matching elements */
  selector: string;
  /** Optional predicate function to filter elements */
  predicate?: (element: U) => boolean;
};

/**
 * Gets the first available element from a container that matches the given selector.
 *
 * This function searches for elements within a container using a CSS selector.
 * It applies an optional predicate filter to further refine the selection.
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
 */
export function getFirstElement<T extends HTMLElement, U extends HTMLElement>(
  options: GetFirstElementOptions<T, U>,
): U | null {
  const { containerElement, selector, predicate } = options;
  const items = Array.from(containerElement.querySelectorAll<U>(selector));
  if (items.length === 0) return null;

  for (const item of items) {
    if (predicate && !predicate(item)) continue;
    return item;
  }

  return null;
}
