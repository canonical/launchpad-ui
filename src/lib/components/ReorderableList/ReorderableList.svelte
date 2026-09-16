<script lang="ts" generics="T">
  import { flip } from "svelte/animate";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";
  import { SvelteSet } from "svelte/reactivity";
  import type { TransitionConfig } from "svelte/transition";
  import { setReorderableListContext } from "./context.js";
  import type { ReorderableListProps } from "./types.js";
  import { DragController } from "./utils/DragController.svelte.js";
  import type { DragData } from "./utils/DragController.svelte.js";
  import { KeyboardController } from "./utils/KeyboardController.svelte.js";
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
    dragMode = "preview",
    onpointermove,
    onpointerup,
    onpointercancel,
    onlostpointercapture,
    ...rest
  }: ReorderableListProps<T> = $props();

  const disabled = $derived(!browser || disabledProp);
  /* 
    TODO(@Enzo): Confirm opacity values/tokens
    TODO: JS design tokens
  */
  const overlayOpacity = $derived(dragMode === "drop-indicator" ? 0.5 : 1);

  const animationDuration = $derived(
    prefersReducedMotion.current ? 0 : animationDurationProp,
  );

  let listElement = $state<HTMLElement>();
  const settlingKeys = new SvelteSet<string>();

  const list = new ReorderableList<T>({
    items: () => items,
    setItems: (next) => (items = next),
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    disabled: () => disabled,
  });

  const drag = new DragController(
    list,
    () => listElement,
    () => dragMode,
  );
  const keyboard = new KeyboardController(list);
  const position = new PositionInputController(list);

  const instructionsId = $props.id();

  setReorderableListContext({
    list,
    drag,
    keyboard,
    position,
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    instructionsId,
    get disabled() {
      return disabled;
    },
  });

  function settleOverlay(
    _node: HTMLElement,
    dragData: DragData,
  ): TransitionConfig {
    // Target the real item's resting spot rather than the overlay's pickup spot.
    if (!listElement) return {};
    const targetElement = list.elementFor(dragData.key);
    if (!targetElement) return {};
    const targetTop = listCoordinates(listElement).listToViewport(
      targetElement.offsetTop,
    );
    const correction = targetTop - dragData.rect.top;
    const opacity = overlayOpacity;

    return {
      duration: animationDuration,
      easing: TRANSITION_EASING,
      css: (t) =>
        `transform: translateY(${correction + t * (dragData.travel - correction)}px); opacity: ${1 + t * (opacity - 1)}; box-shadow: none;`,
    };
  }

  const displayItems = $derived(
    dragMode === "drop-indicator" && drag.isDragging()
      ? items
      : list.itemsWithPendingReorder,
  );
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
  {...rest}
>
  {#each displayItems as entry, index (key(entry))}
    <li
      class:grabbed={keyboard.isGrabbed(key(entry))}
      class:settling={settlingKeys.has(key(entry))}
      data-dragging={drag.isDragging(key(entry)) ? dragMode : undefined}
      data-dropindicator={drag.dropIndicator &&
      drag.dropIndicator.index === index
        ? drag.dropIndicator.edge
        : undefined}
      animate:flip={{
        duration: animationDuration,
        easing: TRANSITION_EASING,
      }}
      {@attach list.registerItem(key(entry))}
    >
      {@render item({ item: entry, index })}
    </li>
  {/each}
  <!-- 
    Degraded #each instead of an #if block trick to preserve the dragData for the settle transition without synchronization effects.
  -->
  {#each drag.dragData && list.indexOf(drag.dragData.key) !== -1 ? [drag.dragData] : [] as dragData (dragData.key)}
    {const index = $derived(list.indexOf(dragData.key))}
    <li
      class="drag-overlay"
      aria-hidden="true"
      inert
      style:--overlay-opacity={overlayOpacity}
      style:top={`${dragData.rect.top}px`}
      style:left={`${dragData.rect.left}px`}
      style:width={`${dragData.rect.width}px`}
      style:height={`${dragData.rect.height}px`}
      style:transform={`translateY(${dragData.travel}px)`}
      out:settleOverlay={dragData}
      onoutrostart={() => settlingKeys.add(dragData.key)}
      onoutroend={() => settlingKeys.delete(dragData.key)}
      // A trick to force the element onto the top-layer escaping any potential containing blocks that could throw off the viewport-relative positioning. Also ensures that the overlay isn't clipped now matter what.
      popover="manual"
      {@attach (el) => el.showPopover()}
    >
      {@render item({ item: list.itemsWithPendingReorder[index], index })}
    </li>
  {/each}
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
`ReorderableList` renders an ordered list whose items can be rearranged with pointer dragging, keyboard controls, or direct position input.

Provide `items`, a stable `key`, and `itemLabel` for accessible control labels and status announcements. The `item` snippet receives `{ item, index }`, which can be spread onto `ReorderableList.Item` to render the default drag handle and position input around custom item content.

During pointer dragging, the snippet is also rendered in an inert fixed-position preview. Each rendering has independent component state; use instance-specific IDs (for example `$props.id()`) rather than fixed IDs inside the snippet.

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
      transition: box-shadow var(--ds-transition-duration-fast)
        var(--ds-transition-timing-ease-out);

      /* TODO: Shadow design tokens */
      --grabbed-shadow:
        0 1px 2px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.2);

      &[data-dragging="preview"] {
        opacity: 0;
        transition: none;
      }

      &[data-dragging="drop-indicator"] {
        /* TODO(@Enzo): Confirm opacity values/tokens */
        opacity: 0.3;
        transition: none;
      }

      &.settling {
        opacity: 0;
      }

      &[data-dropindicator] {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          inset-inline: 0;
          border-top: var(--dimension-stroke-thickness-large) solid
            var(--color-focusRing);
          pointer-events: none;
          z-index: 1;
        }
      }

      &[data-dropindicator="before"]::after {
        top: 0;
      }

      &[data-dropindicator="after"]::after {
        bottom: 0;
      }

      &.drag-overlay {
        border: none;
        position: fixed;
        inset: auto;
        pointer-events: none;
        transition: none;
        box-shadow: var(--grabbed-shadow);
        opacity: var(--overlay-opacity);
      }

      &.grabbed {
        z-index: 1;
        position: relative;
        box-shadow: var(--grabbed-shadow);
      }
    }
  }
</style>
