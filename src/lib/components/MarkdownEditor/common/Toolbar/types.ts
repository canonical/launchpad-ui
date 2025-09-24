/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export type MarkdownEditorToolbarContext = {
  selectedAction: HTMLButtonElement | undefined;
  get actions(): HTMLButtonElement[];
  addAction: (action: HTMLButtonElement) => void;
  removeAction: (action: HTMLButtonElement) => void;
};

type BaseProps = SvelteHTMLElements["div"];
export interface MarkdownEditorToolbarProps extends BaseProps {
  /**
   * The ref of the toolbar.
   *
   * **@bindable**
   */
  ref?: HTMLDivElement;

  /**
   * Whether to hide the default actions.
   * TODO: this is a temporary prop, to have an empty toolbar for component testing
   */
  noDefaultActions?: boolean;
}
