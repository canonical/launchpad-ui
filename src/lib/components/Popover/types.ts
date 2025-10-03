/* @canonical/generator-ds 0.10.0-experimental.0 */

import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { HTMLButtonAttributes, SvelteHTMLElements } from "svelte/elements";
import type { WithoutChildren } from "$lib/type-utils.js";
import type {
  PositionArea,
  PositionTryFallback,
} from "$lib/usePositionArea.svelte.js";

type BaseProps = WithoutChildren<SvelteHTMLElements["div"]>;
type PopoverTarget = NonNullable<HTMLButtonAttributes["popovertarget"]>;

export type TriggerProps = {
  popovertarget: PopoverTarget;
  [key: symbol]: Attachment<HTMLElement>;
};

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
   * - `triggerProps`: Props that should be spread on the button element to make it control the popover:
   *   - `popovertarget`: The id of the popover element. Setting this attribute on the enables declarative control of the popover;
   *   - attachment enabling JS-based positioning fallback for unsupported browsers (see `position` prop);
   * - `open`: A boolean indicating whether the popover is open or closed.
   */
  trigger: Snippet<[triggerProps: TriggerProps, open: boolean]>;
  /**
   * Content to be displayed inside the popover.
   *
   * Snippet arguments:
   * - `popovertarget`: The id of the popover element. Set it as `popovertarget` attribute on the button element you want to use to control the popover.
   */
  children: Snippet<[popovertarget: PopoverTarget]>;
  /**
   * Popover position. This is a subset of valid CSS [<position-area>](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area) keyword combinations.
   *
   * Ideally this should not be a prop, but be handled 100% by CSS offering maximal flexibility and positioning without the need of JavaScript, but as for now, Firefox and Safari do not support `position-area`. Passing this as a prop allows for a JS-driven fallback behavior for unsupported browsers.
   *
   * @default "block-end span-inline-end"
   */
  position?: PositionArea; //TODO(position-area): To be removed when `position-area` has acceptable support (see: https://developer.mozilla.org/en-US/docs/Web/CSS/position-area#browser_compatibility).
  /**
   * If specified, defines how the popover should try to fallback to a different position when the preferred position (set via `position` prop) is not possible due to lack of space in the viewport.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks#try-tactic
   *
   */
  positionTryFallback?: PositionTryFallback;
}

export interface PopoverMethods {
  showPopover: () => void;
  hidePopover: () => void;
  togglePopover: () => void;
}
