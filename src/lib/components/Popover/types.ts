/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { HTMLButtonAttributes, SvelteHTMLElements } from "svelte/elements";

type BaseProps = SvelteHTMLElements["div"];

export type BlockPosition = "block-start" | "block-end";
export type InlinePosition =
  | "span-inline-start"
  | "span-inline-end"
  | "span-all";
export type PositionArea = `${BlockPosition} ${InlinePosition}`;

export interface PopoverProps extends BaseProps {
  /**
   * The type of the popover. See [HTML popover global attribute MDN page](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover) for more details.
   *
   * @default "auto"
   */
  popover?: Exclude<BaseProps["popover"], "" | null>;
  /**
   * A snippet containing a button element that triggers the popover.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the popover element. Set it as `popovertarget` attribute on the button element you want to use as the trigger.
   * - `open`: A boolean indicating whether the popover is open or closed.
   */
  trigger: Snippet<
    [
      popovertarget: NonNullable<HTMLButtonAttributes["popovertarget"]>,
      open: boolean,
    ]
  >;
  /**
   * Content to be displayed inside the popover.
   */
  children: Snippet;
  /**
   * Popover position. This is a subset of valid CSS [<position-area>](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area) keyword combinations.
   *
   * Ideally this should not be a prop, but be handled 100% by CSS offering maximal flexibility and positioning without the need of JavaScript, but as for now, Firefox and Safari do not support `position-area`. Passing this as a prop allows for a JS-driven fallback behavior for unsupported browsers.
   *
   * @default "block-end span-inline-end"
   */
  position?: PositionArea; //TODO(position-area): To be removed when `position-area` has acceptable support (see: https://developer.mozilla.org/en-US/docs/Web/CSS/position-area#browser_compatibility).
}

export interface PopoverMethods {
  showPopover: () => void;
  hidePopover: () => void;
  togglePopover: () => void;
}
