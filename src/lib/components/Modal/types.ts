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
type BaseProps = Omit<HTMLDialogAttributes, "open">;
type PopoverTarget = Exclude<HTMLButtonAttributes["popovertarget"], null>;

export interface ModalProps extends BaseProps {
  /**
   * A snippet containing a button element that triggers the modal.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the modal element. Set it as `popovertarget` attribute on the button element to provide a no-JS fallback for opening the modal. If there is JS, this will be `undefined`. The `showModal` should be used whenever possible as it provides better accessibility (e.g. making the rest of the document inert).
   * - `showModal`: A function to open the modal.
   */
  trigger?: Snippet<[popovertarget: PopoverTarget, showModal: () => void]>;
  /**
   * Whether to close the modal when clicking outside of it.
   *
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to show a close button in the header.
   *
   * @default true
   */
  withCloseButton?: boolean;
  /**
   * Header of the modal.
   */
  header?: Snippet;
  /**
   * Footer of the modal. Usually contains action buttons.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the modal element. Set it as `popovertarget` attribute on the button elements you want use to close the modal in a no-JS fallback mode.
   * - `close`: A function to close the modal.
   */
  footer?: Snippet<[popovertarget: PopoverTarget, close: () => void]>;
}

export interface ModalMethods {
  showModal: () => void;
  close: () => void;
}
