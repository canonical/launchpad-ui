/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { SvelteHTMLElements } from "svelte/elements";

export type MarkdownEditorToolbarContext = {
  /**
   * The currently selected action button.
   */
  selectedAction: HTMLButtonElement | undefined;
  /**
   * To be called when action buttons are mounted, to select the first action button.
   */
  setDefaultAction(): void;
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
   */
  noDefaultActions?: boolean;
}
