/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";
import type { Shortcut } from "$lib/shortcut";

export type MarkdownEditorToolbarContext = {
  /**
   * The currently selected action button.
   */
  selectedAction: HTMLButtonElement | undefined;
  /**
   * To be called when action buttons are mounted or changed, to select the first action button.
   */
  notifyActionButtonChange(): void;
};

type BaseProps = SvelteHTMLElements["div"];
export interface ToolbarProps extends BaseProps {
  /**
   * The ref of the toolbar.
   *
   * **@bindable**
   */
  ref?: HTMLDivElement;

  /**
   * Whether to hide the default actions.
   * TODO: this is a temporary prop, to have an empty toolbar for component testing
   *
   * @link
   */
  noDefaultActions?: boolean;
}

export type ActionShortcut = {
  label: string;
  shortcut: Shortcut;
  callback: (textarea: HTMLTextAreaElement) => void;
};
