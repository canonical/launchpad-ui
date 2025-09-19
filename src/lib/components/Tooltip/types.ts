/* @canonical/generator-ds 0.10.0-experimental.3 */

import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type {
  FocusEventHandler,
  MouseEventHandler,
  SvelteHTMLElements,
} from "svelte/elements";
import type {
  PositionArea,
  PositionTryFallback,
} from "$lib/usePositionArea.svelte.js";

type BaseProps = SvelteHTMLElements["div"];

type TriggerProps = {
  onfocus: FocusEventHandler<HTMLElement>;
  onmouseenter: MouseEventHandler<HTMLElement>;
  onmouseleave: MouseEventHandler<HTMLElement>;
  "aria-describedby": string;
  [key: symbol]: Attachment<HTMLElement>;
};

export interface TooltipProps extends BaseProps {
  /**
   * Elements that trigger the tooltip when hovered or focused.
   */
  trigger: Snippet<[triggerProps: TriggerProps]>;
  /**
   * Content to be displayed inside the tooltip.
   */
  children: Snippet<[]>;
  /**
   * Tooltip position. This is a subset of valid CSS [<position-area>](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area) keyword combinations.
   *
   * @default "block-start"
   */
  position?: PositionArea;
  /**
   * If specified, defines how the tooltip should try to fallback to a different position when the preferred position (set via `position` prop) is not possible due to lack of space in the viewport.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks#try-tactic
   *
   */
  positionTryFallback?: PositionTryFallback;
}
