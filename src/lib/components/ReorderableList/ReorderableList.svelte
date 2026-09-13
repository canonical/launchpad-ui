<script lang="ts" generics="T">
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";
  import type { TransitionConfig } from "svelte/transition";
  import { setReorderableListContext } from "./context.js";
  import type { ReorderableListProps } from "./types.js";
  import { KeyboardGrabController } from "./utils/KeyboardGrabController.svelte.js";
  import { PointerDragController } from "./utils/PointerDragController.svelte.js";
  import type { DragData } from "./utils/PointerDragController.svelte.js";
  import { PositionInputController } from "./utils/PositionInputController.js";
  import { ReorderableList } from "./utils/ReorderableList.svelte.js";
  import { listCoordinates } from "./utils/listCoordinates.js";
  import { browser } from "$app/env";

  const componentCssClassName = "ds reorderable-list";
  const TRANSITION_EASING = cubicOut;

  let {
    class: className,
    items = $bindable(),
    key,
    itemLabel,
    item,
    disabled: disabledProp = false,
    animationDuration: animationDurationProp = 200,
    onpointermove,
    onpointerup,
    onpointercancel,
    onlostpointercapture,
    ...rest
  }: ReorderableListProps<T> = $props();

  const disabled = $derived(!browser || disabledProp);

  const animationDuration = $derived(
    prefersReducedMotion.current ? 0 : animationDurationProp,
  );

  let listElement = $state<HTMLElement>();

  const list = new ReorderableList<T>({
    items: () => items,
    setItems: (next) => (items = next),
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    disabled: () => disabled,
  });

  const drag = new PointerDragController(list, () => listElement);
  const grab = new KeyboardGrabController(list);
  const position = new PositionInputController(list);

  const instructionsId = $props.id();

  setReorderableListContext({
    list,
    drag,
    grab,
    position,
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    instructionsId,
    get disabled() {
      return disabled;
    },
  });

  // When the drag is already gone, we still need the last travel/key to animate from where it was dropped off to its final position.
  let lastDragData = $state<DragData>();
  $effect(() => {
    if (drag.dragged) {
      lastDragData = drag.dragged;
    }
  });

  function settleOverlay(node: HTMLElement): TransitionConfig {
    // Target the real item's resting spot rather than the overlay's pickup spot.
    if (!lastDragData || !listElement) return {};
    const targetElement = list.elementFor(lastDragData.key);
    if (!targetElement) return {};
    const targetTop = listCoordinates(listElement).listToViewport(
      targetElement.offsetTop,
    );
    const correction = targetTop - parseFloat(node.style.top || "0");

    const lastTravel = lastDragData.travel ?? 0;

    node.classList.add("settling");
    return {
      duration: animationDuration,
      easing: TRANSITION_EASING,
      css: (t) =>
        `transform: translateY(${correction + t * (lastTravel - correction)}px)`,
    };
  }
</script>

<ol
  bind:this={listElement}
  role="list"
  class={[componentCssClassName, className]}
  class:dragging={drag.isDragging()}
  onpointermove={(event) => {
    drag.onpointermove(event);
    onpointermove?.(event);
  }}
  onpointerup={(event) => {
    drag.onpointerup(event);
    onpointerup?.(event);
  }}
  onpointercancel={(event) => {
    drag.onpointercancel(event);
    onpointercancel?.(event);
  }}
  onlostpointercapture={(event) => {
    drag.onlostpointercapture(event);
    onlostpointercapture?.(event);
  }}
  style:--reappear-after-settle-delay={`${animationDuration}ms`}
  {...rest}
>
  {#each list.displayItems as entry, index (key(entry))}
    <li
      class:dragging={drag.isDragging(key(entry))}
      class:grabbed={grab.isGrabbed(key(entry))}
      animate:flip={{
        duration: animationDuration,
        easing: TRANSITION_EASING,
      }}
      {@attach list.registerItem(key(entry))}
    >
      {@render item({ item: entry, index })}
    </li>
  {/each}
  {#if drag.dragged && list.indexOf(drag.dragged.key) !== -1}
    {const index = $derived(list.indexOf(drag.dragged.key))}
    <li
      popover="manual"
      class="drag-overlay"
      aria-hidden="true"
      inert
      style:top={`${drag.dragged.rect.top}px`}
      style:left={`${drag.dragged.rect.left}px`}
      style:width={`${drag.dragged.rect.width}px`}
      style:height={`${drag.dragged.rect.height}px`}
      style:transform={`translateY(${drag.dragged.travel}px)`}
      out:settleOverlay
      // A trick to force the element onto the top-layer escaping any potential containing blocks that could throw off the viewport-relative positioning. Also ensures that the overlay isn't clipped now matter what.
      {@attach (el) => el.showPopover()}
    >
      {@render item({ item: list.displayItems[index], index })}
    </li>
  {/if}
</ol>

<div id={instructionsId} class="visually-hidden">
  Press Enter or Space to pick up the item, then use the arrow keys to move it
  and Enter or Space to drop it. Press Escape to cancel. Alternatively, hold Alt
  and press the up or down arrow key to move the item one position at a time.
</div>
<div role="status" aria-atomic="true" class="visually-hidden">
  {list.announcement}
</div>

<!-- @component
`ReorderableList` renders an ordered list whose items can be rearranged with
pointer dragging, keyboard controls, or direct position input.

Provide `items`, a stable `key`, and `itemLabel` for accessible control labels
and status announcements. The `item` snippet receives `{ item, index }`, which
can be spread onto `ReorderableList.Item` to render the default drag handle and
position input around custom item content.

During pointer dragging, the snippet is also rendered in an inert fixed-position
preview. Each rendering has independent component state; use instance-specific
IDs (for example `$props.id()`) rather than fixed IDs inside the snippet.

## Example Usage
```svelte
<script lang="ts">
  let items = $state([
    { id: "all", name: "All packages" },
    { id: "owned", name: "Owned by me" },
  ]);
</script>

<ReorderableList
  bind:items
  key={(item) => item.id}
  itemLabel={(item) => item.name}
>
  {#snippet item(props)}
    <ReorderableList.Item {...props}>
      <span>{props.item.name}</span>
    </ReorderableList.Item>
  {/snippet}
</ReorderableList>
```
-->

<style>
  .ds.reorderable-list {
    list-style: none;
    isolation: isolate;
    /* Item offsetTop values are relative to the list padding box. */
    position: relative;

    &.dragging {
      cursor: grabbing;
      user-select: none;

      > :global(*) {
        pointer-events: none;
      }
    }

    > li {
      background-color: var(--color-background);
      box-shadow: none;
      transition:
        box-shadow var(--ds-transition-duration-fast)
          var(--ds-transition-timing-ease-out),
        /* Delay the reappearance of the item until the overlay comes back into place */
        opacity 0s linear var(--reappear-after-settle-delay);

      /* TODO: Shadow design tokens */
      --grabbed-shadow:
        0 1px 2px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.2);

      &.dragging {
        opacity: 0;
        transition: none;
      }

      &.drag-overlay {
        border: none;
        position: fixed;
        inset: auto;
        pointer-events: none;
        transition: none;
        box-shadow: var(--grabbed-shadow);

        &.settling {
          box-shadow: none;
        }
      }

      &.grabbed {
        z-index: 1;
        position: relative;
        box-shadow: var(--grabbed-shadow);
      }
    }
  }
</style>
