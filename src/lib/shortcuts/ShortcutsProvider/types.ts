/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { Shortcut } from "../index.js";

export interface ShortcutsProviderProps {
  /**
   * Content to wrap with the provider
   */
  children: Snippet<[]>;
  /**
   * Whether to ignore shortcuts matching when the target of the keyboard event is an input, textarea or select element
   *
   * @default false
   */
  ignoreIfTyping?: boolean;
}

export interface GlobalShortcutsProviderProps extends ShortcutsProviderProps {
  /**
   * Whether to ignore shortcuts matching when the target of the keyboard event is an input, textarea or select element
   *
   * @default true
   */
  ignoreIfTyping?: boolean;
}

export interface UseShortcutsProps {
  shortcuts: Shortcut[] | Shortcut | undefined;
}

export type ShortcutsContext = {
  registerShortcuts(...shortcuts: Shortcut[]): () => void;
  get shortcuts(): ReadonlyArray<Shortcut>;
};
