import { SvelteSet } from "svelte/reactivity";
import { Shortcut } from "../../Shortcut.svelte.js";
import { setShortcutsContext } from "../context.js";

export function useShortcutProvider() {
  const shortcuts = new SvelteSet<Shortcut>();

  const onkeydown = (event: KeyboardEvent) => {
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
