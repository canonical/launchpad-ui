/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { Shortcut } from "../index.js";

export interface ShortcutsProviderProps {
  children: Snippet<[]>;
}

export interface UseShortcutsProps {
  shortcuts: Shortcut[] | Shortcut | undefined;
}

export type ShortcutsContext = {
  registerShortcuts(...shortcuts: Shortcut[]): () => void;
  get shortcuts(): ReadonlyArray<Shortcut>;
};
