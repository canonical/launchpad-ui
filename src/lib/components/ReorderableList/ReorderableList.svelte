<script lang="ts" generics="T">
  import { flip } from "svelte/animate";
  import { prefersReducedMotion } from "svelte/motion";
  import { setReorderableListContext } from "./context.js";
  import type { ReorderableListProps } from "./types.js";
  import { KeyboardGrabController } from "./utils/KeyboardGrabController.svelte.js";
  import { PointerDragController } from "./utils/PointerDragController.svelte.js";
  import { PositionInputController } from "./utils/PositionInputController.js";
  import { ReorderableList } from "./utils/ReorderableList.svelte.js";
  import { browser } from "$app/env";

  const componentCssClassName = "ds reorderable-list";

  let {
    class: className,
    items = $bindable(),
    key,
    itemLabel,
    item,
    disabled: disabledProp = false,
    animationDuration: animationDurationProp = 200,
    ...rest
  }: ReorderableListProps<T> = $props();

  const disabled = $derived(!browser || disabledProp);

  const animationDuration = $derived(
    prefersReducedMotion.current ? 0 : animationDurationProp,
  );

  const list = new ReorderableList<T>({
    items: () => items,
    setItems: (next) => (items = next),
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    disabled: () => disabled,
  });

  const drag = new PointerDragController(list, () => animationDuration);
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
</script>

<ol
  role="list"
  class={[componentCssClassName, className]}
  class:dragging={drag.isDragging()}
  onpointermove={drag.onpointermove}
  onpointerup={drag.onpointerup}
  onpointercancel={drag.onpointercancel}
  onlostpointercapture={drag.onlostpointercapture}
  {@attach drag.registerList}
  {...rest}
>
  {#each list.displayItems as entry, index (key(entry))}
    <li
      data-dragstate={drag.dragStateFor(key(entry))}
      class:grabbed={grab.isGrabbed(key(entry))}
      style:transform={drag.transformFor(key(entry))}
      animate:flip={{
        duration:
          drag.dragStateFor(key(entry)) === undefined ? animationDuration : 0,
      }}
      {@attach list.registerItem(key(entry))}
    >
      {@render item({ item: entry, index })}
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
`ReorderableList` renders an ordered list whose items can be rearranged with
pointer dragging, keyboard controls, or direct position input.

Provide `items`, a stable `key`, and `itemLabel` for accessible control labels
and status announcements. The `item` snippet receives `{ item, index }`, which
can be spread onto `ReorderableList.Item` to render the default drag handle and
position input around custom item content.

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

      &[data-dragstate="dragging"],
      &.grabbed {
        z-index: 1;
        position: relative;
        /* TODO: Shadow design tokens */
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.15),
          0 8px 20px rgba(0, 0, 0, 0.2);
      }

      &[data-dragstate="settling"] {
        position: relative;
        z-index: 1;
      }
    }
  }
</style>
