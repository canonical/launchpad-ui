<script lang="ts" generics="T">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { DragIcon } from "@canonical/svelte-icons";
  import { flip } from "svelte/animate";
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
    extraContent,
    disabled = false,
    duration = 200,
    ...rest
  }: ReorderableListProps<T> = $props();

  const list = new ReorderableList<T>({
    items: () => items,
    setItems: (next) => (items = next),
    key: (entry) => key(entry),
    itemLabel: (entry) => itemLabel(entry),
    disabled: () => !browser || disabled,
    duration: () => duration,
  });

  const drag = new PointerDragController(list);
  const grab = new KeyboardGrabController(list);
  const position = new PositionInputController(list);

  const instructionsId = $props.id();
</script>

<ol class={[componentCssClassName, className]} role="list" {...rest}>
  {#each items as entry, index (key(entry))}
    <li
      class:dragging={drag.isDragging(key(entry))}
      class:grabbed={grab.isGrabbed(key(entry))}
      style:transform={drag.transformFor(key(entry))}
      animate:flip={{ duration: drag.flipDuration(key(entry)) }}
      {@attach list.registerItem(key(entry))}
    >
      <div class="main-row">
        <Button
          severity="base"
          type="button"
          density="dense"
          class={["handle", { dragging: drag.isDragging(key(entry)) }]}
          {disabled}
          aria-label="Reorder {itemLabel(entry)}"
          aria-describedby={instructionsId}
          aria-pressed={grab.isGrabbed(key(entry))}
          onpointerdown={(event) => drag.onpointerdown(event, key(entry))}
          onkeydown={(event) => grab.onkeydown(event, key(entry))}
          onblur={() => grab.onblur(key(entry))}
        >
          {#snippet iconLeft()}
            <DragIcon />
          {/snippet}
        </Button>

        <input
          type="number"
          inputmode="numeric"
          autocomplete="off"
          min="1"
          max={items.length}
          {disabled}
          aria-label="Position of {itemLabel(entry)}"
          value={index + 1}
          onkeydown={(event) => position.onkeydown(event, key(entry))}
          onblur={(event) => position.onblur(event, key(entry))}
        />

        <div class="content">
          {@render item(entry)}
        </div>
      </div>
      {@render extraContent?.(entry)}
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

<style>
  .ds.reorderable-list {
    list-style: none;
    isolation: isolate;

    &:has(> li.dragging) {
      user-select: none;
    }

    > li {
      background-color: var(--color-background);
      box-shadow: none;
      transition: box-shadow var(--ds-transition-duration-fast)
        var(--ds-transition-timing-ease-out);

      &.dragging {
        user-select: none;
        cursor: grabbing;

        :global(*) {
          pointer-events: none;
        }
      }

      &.dragging,
      &.grabbed {
        z-index: 1;
        position: relative;
        /* TODO: Shadow design tokens */
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.15),
          0 8px 20px rgba(0, 0, 0, 0.2);
      }

      > .main-row {
        display: flex;
        align-items: center;
        gap: var(--dimension-100);
        padding-block: var(--dimension-050);
        flex: 1;
        border-bottom: var(--dimension-stroke-thickness-medium) solid
          var(--color-border-muted);

        /* TODO(DAL-input): Style the input to visually match the design */
        > input {
          font: var(--lp-typography-paragraph-s);
          border: none;
          padding: var(--dimension-050) var(--dimension-100);
          text-align: center;
          background-color: var(--color-foreground-input);
          min-width: min-content;
          appearance: textfield;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            display: none;
          }

          &:hover {
            background-color: var(--color-foreground-input-hover);
          }
        }

        :global(.handle) {
          touch-action: none;
          cursor: grab;
          --color-background-button-hover: var(--color-background-button);
          --color-background-button-active: var(--color-background-button);
        }

        > .content {
          flex: 1;
        }
      }
    }
  }
</style>
