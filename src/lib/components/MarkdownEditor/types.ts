/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { Shortcut, ShortcutsManager } from "$lib/shortcut";

export type EditorMode = "preview" | "edit";

export interface MarkdownEditorContext {
  /** The textarea element, containing the markdown content. */
  textareaElement: HTMLTextAreaElement | undefined;

  /** Additional shortcuts to register for the textarea element. */
  shortcuts: Shortcut<HTMLTextAreaElement>[];

  /** The shortcuts manager for the textarea element. */
  get shortcutsManager(): ShortcutsManager<HTMLTextAreaElement>;
}

type BaseProps = SvelteHTMLElements["div"];

export type MarkdownEditorProps = BaseProps;
