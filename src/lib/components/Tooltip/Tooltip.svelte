<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts" module>
  function isEventTargetIn(
    eventTarget: EventTarget | null,
    element: HTMLElement | undefined,
  ) {
    return (
      element &&
      eventTarget &&
      eventTarget instanceof Node &&
      (eventTarget === element || element.contains(eventTarget))
    );
  }
</script>

<script lang="ts">
  import { flip, offset } from "@floating-ui/dom";
  import type { ComputePositionConfig, Placement } from "@floating-ui/dom";
  import { untrack } from "svelte";
  import { createAttachmentKey } from "svelte/attachments";
  import type { Attachment } from "svelte/attachments";
  import {
    positionAreaFallbackMap,
    useFloatingUI,
  } from "$lib/usePositionArea.svelte.js";
  import type { TooltipProps } from "./types.js";

  const componentCssClassName = "ds tooltip";
  const distanceToTrigger = 12;

  let {
    id: idProp,
    class: className,
    children,
    trigger,
    position = "block-start",
    autoAdjust = true,
    delay = 350,
    onmouseleave: onmouseleaveProp,
    onmouseenter: onmouseenterProp,
    ...rest
  }: TooltipProps = $props();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);
  let tooltipRef = $state<HTMLElement>();
  let triggerRef = $state<HTMLElement>();

  let triggerFocused = $state(false);
  let triggerHovered = $state(false);
  let tooltipHovered = $state(false);
  const open = $derived(triggerFocused || triggerHovered || tooltipHovered);

  const tooltipPosition = $state({ top: "auto", left: "auto" });
  let tooltipPlacement = $derived<Placement>(positionAreaFallbackMap[position]);

  const floatingUiConfig = $derived<Partial<ComputePositionConfig>>({
    placement: positionAreaFallbackMap[position],
    middleware: [offset(distanceToTrigger), autoAdjust && flip()],
  });
  const { triggerAttachment: floatingUiTriggerAttachment, targetAttachment } =
    useFloatingUI(
      // Start positioning even before the tooltip is actually shown (`delayedOpen`)
      () => open,
      () => floatingUiConfig,
      ({ x, y, placement }) => {
        tooltipPosition.top = `${y}px`;
        tooltipPosition.left = `${x}px`;
        tooltipPlacement = placement;
      },
    );

  const listenersTriggerAttachment: Attachment<HTMLElement> = (element) => {
    triggerRef = element;
    const onMouseEnter = () => (triggerHovered = true);
    const onMouseLeave = (e: MouseEvent) => {
      // Check if hover moved to the tooltip, to avoid any flicker before `mouseenter` on the tooltip is fired and handled
      if (isEventTargetIn(e.relatedTarget, tooltipRef)) tooltipHovered = true;
      triggerHovered = false;
    };
    const onFocus = () => (triggerFocused = true);
    const onBlur = () => (triggerFocused = false);

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
      triggerHovered = false;
      triggerFocused = false;
    };
  };

  // Changes to delayOpen are handled in the effect below, so we only want to capture the initial `open` value here
  // svelte-ignore state_referenced_locally
  let delayedOpen = $state(open);
  $effect(() => {
    if (open) {
      const delayTimeout = setTimeout(
        () => {
          delayedOpen = true;
          // Do not rerun if delay changes, apply the new delay only to the next open change
        },
        untrack(() => delay),
      );

      return () => clearTimeout(delayTimeout);
    }

    delayedOpen = false;
  });

  const onmouseenter: typeof onmouseenterProp = (e) => {
    onmouseenterProp?.(e);
    tooltipHovered = true;
  };

  const onmouseleave: typeof onmouseleaveProp = (e) => {
    onmouseleaveProp?.(e);
    // Check if hover moved to the trigger, to avoid any flicker before `mouseenter` on the trigger is fired and handled
    if (isEventTargetIn(e.relatedTarget, triggerRef)) triggerHovered = true;
    tooltipHovered = false;
  };
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") {
      // If escape is pressed, close the tooltip no matter what caused it to open
      triggerFocused = false;
      triggerHovered = false;
      tooltipHovered = false;
    }
  }}
/>

{@render trigger({
  "aria-describedby": id,
  [createAttachmentKey()]: floatingUiTriggerAttachment,
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
  style:visibility={delayedOpen ? "visible" : "hidden"}
  {@attach targetAttachment}
  style:top={tooltipPosition.top}
  style:left={tooltipPosition.left}
  style:--distance-to-trigger={`${distanceToTrigger}px`}
  data-placement={tooltipPlacement}
  {onmouseenter}
  {onmouseleave}
  {...rest}
>
  {@render children()}
</div>

<!-- @component
`Tooltip` are non-interactive elements that aim to provide additional information about a specific element or action.

Tooltip requires JavaScript to function correctly. If JavaScript is disabled, the tooltip content will not be accessible.
TODO(no-js): Investigate how to handle tooltips without JavaScript.


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
    /* TODO(@Enzo): Add missing token */
    --color-background-tooltip: #202020;
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
        width: 100%;
        left: 0;
        height: var(--distance-to-trigger);
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
        width: 100%;
        left: 0;
        height: var(--distance-to-trigger);
        top: calc(-1 * var(--distance-to-trigger));
      }

      &::after {
        border-bottom-color: var(--color-background-tooltip);
        bottom: 100%;
      }
    }

    &[data-placement$="start"]::after {
      /* top-start, bottom-start */
      left: var(--dimension-offset-tooltip-arrow);
    }

    &[data-placement$="end"]::after {
      /* top-end, bottom-end */
      right: var(--dimension-offset-tooltip-arrow);
    }

    &[data-placement="top"]::after,
    &[data-placement="bottom"]::after {
      left: 50%;
      transform: translateX(-50%);
    }

    &[data-placement="left"] {
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

    &[data-placement="right"] {
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
