import type { Attachment } from "svelte/attachments";
import { ShortcutsManager } from "./shortcuts-manager";

// a fn that returns attachement handler similar to useAreaPosition
export function useShortcutsManager<T extends HTMLElement>(
  shortcutsManager: () => ShortcutsManager<T>,
) {
  const targetAttachment: Attachment<T> = (node) => {
    shortcutsManager().register(node);
    return () => {
      shortcutsManager().unregister(node);
    };
  };

  return {
    targetAttachment,
  };
}
