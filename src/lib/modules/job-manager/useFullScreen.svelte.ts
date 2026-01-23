import { goto } from "$app/navigation";
import { page } from "$app/state";

const queryParamName = "full-screen";

export function useFullScreen() {
  const isEnabled = $derived(
    page.url.searchParams.get(queryParamName) === "true",
  );

  const toggleHref = $derived.by(() => {
    // Non-reactive URL is ok, as page itself is reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const url = new URL(page.url);
    if (isEnabled) {
      url.searchParams.delete(queryParamName);
    } else {
      url.searchParams.set(queryParamName, "true");
    }
    return url.pathname + url.search;
  });

  /**
   * Enable full-screen mode by adding the query parameter to the URL.
   */
  const enable = () => {
    // Non-reactive URL is ok, as page itself is reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const url = new URL(page.url);
    url.searchParams.set(queryParamName, "true");
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.pathname + url.search);
  };

  /**
   * Disable full-screen mode by removing the query parameter from the URL.
   */
  const disable = () => {
    // Non-reactive URL is ok, as page itself is reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const url = new URL(page.url);
    url.searchParams.delete(queryParamName);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.pathname + url.search);
  };

  /**
   * Toggle full-screen mode by adding or removing the query parameter from the URL.
   */
  const toggle = () => (isEnabled ? disable() : enable());

  return {
    /**
     * Whether full-screen mode is enabled.
     */
    get isEnabled() {
      return isEnabled;
    },
    /**
     * Get href to toggle full-screen mode.
     *
     * @example <a href={toggleHref}>Toggle Full Screen</a>
     *
     * This link will add or remove the query parameter to enable or disable full-screen mode.
     */
    get toggleHref() {
      return toggleHref;
    },
    enable,
    disable,
    toggle,
  };
}
