import { goto } from "$app/navigation";
import { page } from "$app/state";

const queryParamName = "full-screen";

export function useFullScreen() {
  const isEnabled = $derived(
    page.url.searchParams.get(queryParamName) !== null,
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

  const enable = () => {
    // Non-reactive URL is ok, as page itself is reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const url = new URL(page.url);
    url.searchParams.set(queryParamName, "true");
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.pathname + url.search);
  };

  const disable = () => {
    // Non-reactive URL is ok, as page itself is reactive
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const url = new URL(page.url);
    url.searchParams.delete(queryParamName);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url.pathname + url.search);
  };

  const toggle = () => (isEnabled ? disable() : enable());

  return {
    get isEnabled() {
      return isEnabled;
    },
    get toggleHref() {
      return toggleHref;
    },
    enable,
    disable,
    toggle,
  };
}
