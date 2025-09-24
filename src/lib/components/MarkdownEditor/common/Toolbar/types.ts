/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export type MarkdownEditorToolbarContext = {
  selectedAction: HTMLButtonElement | undefined;
  get actions(): HTMLButtonElement[];
  addAction: (action: HTMLButtonElement) => void;
  removeAction: (action: HTMLButtonElement) => void;
};

export type MarkdownEditorToolbarProps = SvelteHTMLElements["div"];
