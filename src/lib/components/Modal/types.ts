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

export type ModalTriggerProps = {
  onclick: () => void;
  "aria-haspopup": "dialog";
  popovertarget: PopoverTarget;
};

export interface ModalProps extends BaseProps {
  /**
   * A snippet containing a button element that triggers the modal.
   *
   * Snippet arguments:
   * - `triggerProps`: Props to spread on the button element. It contains:
   *   - `onclick`: An onclick handler to open the modal.
   *   - `aria-haspopup`: Always set to `"dialog"` to indicate that the button opens a dialog.
   *   - `popovertarget`: The id of the modal element. Setting it as `popovertarget` attribute on the button element allows for a no-JS fallback for opening the modal. If there is JS, this will be `undefined`.
   */
  trigger?: Snippet<[triggerProps: ModalTriggerProps]>;
  /**
   * Whether to close the modal when clicking outside of it.
   *
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Content of the modal.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the modal element. Set it as `popovertarget` attribute on the button elements you want use to close the modal in a no-JS fallback mode. If there is JS, this will be `undefined`.
   * - `close`: A function to close the modal.
   */
  children?: Snippet<[popovertarget: PopoverTarget, close: () => void]>;
}

export interface ModalMethods {
  showModal: () => void;
  close: () => void;
}
