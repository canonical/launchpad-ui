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
      toRegister.forEach((shortcut) => shortcuts.add(shortcut));
      return () => toRegister.forEach((shortcut) => shortcuts.delete(shortcut));
    },
    get shortcuts() {
      return Array.from(shortcuts);
    },
  });

  return { onkeydown };
}
