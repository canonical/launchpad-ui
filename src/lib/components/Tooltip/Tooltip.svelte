<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts" module>
  import { ChainingManager } from "./utils/ChainingManager.js";

  const chainingManager = new ChainingManager(350);
</script>

<script lang="ts">
  import { createAttachmentKey } from "svelte/attachments";
  import type { Attachment } from "svelte/attachments";
  import { isEventTargetInElement } from "$lib/utils/index.js";
  import type { TooltipProps } from "./types.js";
  import { useDelayedOpen } from "./utils/useDelayedOpen.svelte.js";
  import { useTooltipPosition } from "./utils/useTooltipPosition.svelte.js";

  const componentCssClassName = "ds tooltip";
  const distanceToTrigger = 12; // px

  let {
    id: idProp,
    class: className,
    children,
    trigger,
    position = "block-start",
    autoAdjust = true,
    delay = 350,
    onmouseleave,
    onmouseenter,
    ...rest
  }: TooltipProps = $props();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);
  let tooltipRef = $state<HTMLElement>();
  let triggerRef = $state<HTMLElement>();

  let isTriggerFocused = $state(false);
  let isTriggerHovered = $state(false);
  let isTooltipHovered = $state(false);
  const open = $derived(
    isTriggerFocused || isTriggerHovered || isTooltipHovered,
  );

  const listenersTriggerAttachment: Attachment<HTMLElement> = (element) => {
    triggerRef = element;
    const onMouseEnter = () => (isTriggerHovered = true);
    const onMouseLeave = (e: MouseEvent) => {
      // Check if hover moved to the tooltip, to avoid any flicker before `mouseenter` on the tooltip is fired and handled
      if (isEventTargetInElement(e.relatedTarget, tooltipRef)) {
        isTooltipHovered = true;
      }
      isTriggerHovered = false;
    };
    const onFocus = () => (isTriggerFocused = true);
    const onBlur = () => (isTriggerFocused = false);

    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
    element.addEventListener("focus", onFocus);
    element.addEventListener("blur", onBlur);

    return () => {
      triggerRef = undefined;
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
      element.removeEventListener("focus", onFocus);
      element.removeEventListener("blur", onBlur);
      isTriggerHovered = false;
      isTriggerFocused = false;
    };
  };

  const tooltipOnmouseenter: typeof onmouseenter = (e) => {
    onmouseenter?.(e);
    isTooltipHovered = true;
  };

  const tooltipOnmouseleave: typeof onmouseleave = (e) => {
    onmouseleave?.(e);
    // Check if hover moved to the trigger, to avoid any flicker before `mouseenter` on the trigger is fired and handled
    if (isEventTargetInElement(e.relatedTarget, triggerRef))
      isTriggerHovered = true;
    isTooltipHovered = false;
  };

  const {
    triggerAttachment: tooltipPositionTriggerAttachment,
    targetAttachment,
    tooltipPosition,
    getTooltipPlacement,
  } = useTooltipPosition(
    // Start positioning even before the tooltip is actually shown (`delayedOpen`)
    () => open,
    () => position,
    () => autoAdjust,
    distanceToTrigger,
  );

  const getDelayedOpen = useDelayedOpen(
    () => open,
    () => delay,
    chainingManager,
  );
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") {
      // If escape is pressed, close the tooltip no matter what caused it to open
      isTriggerFocused = false;
      isTriggerHovered = false;
      isTooltipHovered = false;
    }
  }}
/>

{@render trigger({
  "aria-describedby": id,
  [createAttachmentKey()]: tooltipPositionTriggerAttachment,
  [createAttachmentKey()]: listenersTriggerAttachment,
})}

<div
  bind:this={tooltipRef}
  {id}
  role="tooltip"
  class={[componentCssClassName, className]}
  style:display={open /* Flip to block immediately, so it can be positioned even before shown */
    ? "block"
    : "none"}
  style:visibility={getDelayedOpen() ? "visible" : "hidden"}
  {@attach targetAttachment}
  style:top={tooltipPosition.top}
  style:left={tooltipPosition.left}
  style:--distance-to-trigger={`${distanceToTrigger}px`}
  data-placement={getTooltipPlacement()}
  onmouseenter={tooltipOnmouseenter}
  onmouseleave={tooltipOnmouseleave}
  {...rest}
>
  {@render children()}
</div>

<!-- @component
`Tooltip` are non-interactive elements that aim to provide additional information about a specific element or action.

Tooltip requires JavaScript to function correctly. If JavaScript is disabled, the tooltip content will not be accessible.
TODO(no-js): Investigate how to handle tooltips without JavaScript.

The tooltip enables a short "chaining" window (~350ms) after it closes. If any tooltip's trigger is hovered or focused within this window, the tooltip bypasses `delay` and opens immediately.

## Example Usage
```svelte
<Tooltip position="block-start" delay={500} autoAdjust={true}>
  {#snippet trigger(triggerProps)}
    <Button {...triggerProps}>Hover or focus me</Button>
  {/snippet}
  I am a tooltip!
</Tooltip>
```
-->

<style>
  .ds.tooltip {
    /* TODO(z-index-tokens): Should we tokenize z-indexes? What would they be used for except the tooltip? */
    --z-index-tooltip: 10;
    --color-background-tooltip: var(--tmp-color-background-alt-reversed);
    --color-text-tooltip: var(--tmp-color-text-reversed);
    --dimension-padding-inline-tooltip: var(--tmp-dimension-spacing-inline-m);
    --dimension-padding-block-tooltip: var(--tmp-dimension-spacing-block-xs);
    --typography-tooltip: var(--tmp-typography-paragraph-s);
    --dimension-height-tooltip-arrow: var(--tmp-dimension-size-xxxs);
    --dimension-offset-tooltip-arrow: var(--tmp-dimension-spacing-inline-m);
    --dimension-width-tooltip: max-content;

    position: absolute;
    width: var(--dimension-width-tooltip);
    z-index: var(--z-index-tooltip);
    background-color: var(--color-background-tooltip);
    font: var(--typography-tooltip);
    color: var(--color-text-tooltip);
    padding-inline: var(--dimension-padding-inline-tooltip);
    padding-block: var(--dimension-padding-block-tooltip);

    &::before {
      /* Filler to allow moving the hover from the trigger to the tooltip */
      /* TODO: The filler is always of tooltip width/height, which in case the tooltip is bigger than the trigger in cross axis, will cause it to not disappear even if mouse hover is perceived to be outside bounds of both elements. This doesn't seem to be a major problem, but ideally the filler would match the smaller element's dimensions */
      content: "";
      position: absolute;
      display: block;
    }

    &::after {
      /* Tooltip arrow */
      content: "";
      position: absolute;
      border-width: var(--dimension-height-tooltip-arrow);
      border-style: solid;
      border-color: transparent;
      pointer-events: none;
    }

    &[data-placement^="top"] {
      /* top, top-start, top-end */
      &::before {
        bottom: calc(-1 * var(--distance-to-trigger));
      }

      &::after {
        border-top-color: var(--color-background-tooltip);
        top: 100%;
      }
    }

    &[data-placement^="bottom"] {
      /* bottom, bottom-start, bottom-end */
      &::before {
        top: calc(-1 * var(--distance-to-trigger));
      }

      &::after {
        border-bottom-color: var(--color-background-tooltip);
        bottom: 100%;
      }
    }

    &[data-placement^="top"],
    &[data-placement^="bottom"] {
      &::before {
        width: 100%;
        left: 0;
        height: var(--distance-to-trigger);
      }

      &[data-placement$="start"]::after {
        left: var(--dimension-offset-tooltip-arrow);
      }

      &[data-placement$="end"]::after {
        right: var(--dimension-offset-tooltip-arrow);
      }
    }

    &[data-placement="top"]::after,
    &[data-placement="bottom"]::after {
      left: 50%;
      transform: translateX(-50%);
    }

    &[data-placement^="left"] {
      &::before {
        width: var(--distance-to-trigger);
        right: calc(-1 * var(--distance-to-trigger));
        height: 100%;
        top: 0;
      }

      &::after {
        border-left-color: var(--color-background-tooltip);
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &[data-placement^="right"] {
      &::before {
        width: var(--distance-to-trigger);
        left: calc(-1 * var(--distance-to-trigger));
        height: 100%;
        top: 0;
      }

      &::after {
        border-right-color: var(--color-background-tooltip);
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
