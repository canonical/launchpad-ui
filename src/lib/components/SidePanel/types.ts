/* @canonical/generator-ds 0.10.0-experimental.2 */

import type { Snippet } from "svelte";
import type {
  HTMLButtonAttributes,
  HTMLDialogAttributes,
} from "svelte/elements";

/*
 `open` is omitted, as from the [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#html-only_dialog):
 > Dialogs that are displayed using the open attribute are non-modal.
 > It is possible to toggle the display of the dialog by adding or removing the boolean `open` attribute, but it is not the recommended practice.
*/
type BaseProps = Omit<HTMLDialogAttributes, "open" | "children">;
type PopoverTarget = Exclude<HTMLButtonAttributes["popovertarget"], null>;

export interface SidePanelProps extends BaseProps {
  /**
   * A snippet containing a button element that triggers the side panel.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the side panel element. Set it as `popovertarget` attribute on the button element to provide a no-JS fallback for opening the side panel. If there is JS, this will be `undefined`. The `show` should be used whenever possible as it provides better accessibility (e.g. making the rest of the document inert).
   * - `show`: A function to open the side panel.
   */
  trigger?: Snippet<[popovertarget: PopoverTarget, show: () => void]>;
  /**
   * Whether to close the side panel when clicking outside of it.
   *
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Content of the side panel.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the side panel element. Set it as `popovertarget` attribute on the button elements you want use to close the side panel in a no-JS fallback mode. If there is JS, this will be `undefined`.
   * - `close`: A function to close the side panel.
   */
  children?: Snippet<[popovertarget: PopoverTarget, close: () => void]>;
}

export interface SidePanelMethods {
  show: () => void;
  close: () => void;
}
