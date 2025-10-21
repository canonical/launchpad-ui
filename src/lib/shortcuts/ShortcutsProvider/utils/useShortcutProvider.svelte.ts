import { untrack } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import type { Shortcut } from "../../Shortcut.svelte.js";
import { setShortcutsContext } from "../context.js";

export function useShortcutProvider(ignoreIfTyping: () => boolean) {
  const shortcuts = new SvelteSet<Shortcut>();

  const onkeydown = (event: KeyboardEvent) => {
    if (
      ignoreIfTyping() &&
      event.target instanceof HTMLElement &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (shortcut.matches(event)) {
        if (shortcut.options.stopPropagation) event.stopPropagation();
        if (shortcut.options.preventDefault) event.preventDefault();
        shortcut.callback(event);
      }
    }
  };

  setShortcutsContext({
    registerShortcuts: (...toRegister) => {
      // eslint-disable-next-line svelte/prefer-svelte-reactivity
      const added = new Set<Shortcut>();

      toRegister.forEach((shortcut) => {
        // We only register the shortcut if it hasn't already been registered, and keep track of the ones that were added in this call...
        if (untrack(() => !shortcuts.has(shortcut))) {
          shortcuts.add(shortcut);
          added.add(shortcut);
        }
      });

      // ...so that only those get removed when unregistering. This makes sure that only the component that successfully registered the shortcut can unregister it.
      return () => added.forEach((shortcut) => shortcuts.delete(shortcut));
    },
    get shortcuts() {
      return Array.from(shortcuts);
    },
  });

  return { onkeydown };
}
