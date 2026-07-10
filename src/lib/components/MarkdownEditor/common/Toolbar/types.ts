/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export type ActionItem = {
  readonly element: HTMLButtonElement;
  readonly disabled: boolean;
};

export type MarkdownEditorToolbarContext = {
  /**
   * Registers an action so the toolbar can manage its focus and tab order.
   *
   * @returns A cleanup function that unregisters the action.
   */
  registerActionItem(item: ActionItem): () => void;
  /**
   * Marks the element as the one the user last interacted with (e.g. on click)
   */
  setActiveActionElement(element: HTMLButtonElement): void;
  /**
   * Whether the element is the toolbar's single Tab-focusable action.
   *
   * The toolbar uses a roving tabindex, so only one action is in the tab order
   * (the tab stop) while arrow keys move focus between the rest.
   */
  isTabStop(element: HTMLButtonElement): boolean;
};

type BaseProps = SvelteHTMLElements["div"];
export interface ToolbarProps extends BaseProps {
  /**
   * The ref of the toolbar.
   *
   * **@bindable**
   */
  ref?: HTMLDivElement;
}
