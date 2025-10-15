import type { Shortcut } from "../../Shortcut.svelte.js";
import { getShortcutsContext } from "../context.js";
/**
 * A functions that registers shortcuts in the nearest ShortcutsProvider.
 *
 * The registered shortcuts will be automatically unregistered when the component using this function is destroyed.
 *
 * @returns A function that returns all the currently registered shortcuts.
 */
export function useShortcuts(
  getShortcut?: () => Shortcut | undefined | Shortcut[],
): () => ReadonlyArray<Shortcut> {
  const context = getShortcutsContext();

  if (!context) {
    console.error(
      "useShortcuts must be used within a ShortcutsProvider. The shortcuts will not be registered.",
    );
    return () => [];
  }

  $effect(() => {
    const shortcuts = getShortcut?.();
    if (!shortcuts) return;
    const unregister = Array.isArray(shortcuts)
      ? context.registerShortcuts(...shortcuts)
      : context.registerShortcuts(shortcuts);
    return () => unregister();
  });

  return () => context.shortcuts;
}
