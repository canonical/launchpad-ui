<script lang="ts" generics="T">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { DragIcon } from "@canonical/svelte-icons";
  import { getReorderableListContext } from "../../context.js";
  import type { ItemProps } from "./types.js";

  const componentCssClassName = "ds reorderable-list-item";

  let {
    class: className,
    item,
    index,
    children,
    ...rest
  }: ItemProps<T> = $props();

  const context = getReorderableListContext<T>();
  if (!context) {
    throw new Error("ReorderableList.Item must be used inside ReorderableList");
  }

  const itemKey = $derived(context.key(item));
</script>

<div class={[componentCssClassName, className]} {...rest}>
  <Button
    importance="tertiary"
    type="button"
    density="dense"
    class="handle"
    disabled={context.disabled}
    aria-label="Reorder {context.itemLabel(item)}"
    aria-describedby={context.instructionsId}
    aria-pressed={context.keyboard.isGrabbed(itemKey)}
    onpointerdown={(event) => context.drag.onpointerdown(event, itemKey)}
    onkeydown={(event) => context.keyboard.onkeydown(event, itemKey)}
    onblur={() => {
      context.keyboard.onblur(itemKey);
      context.drag.onblur(itemKey);
    }}
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
    max={context.list.itemsCount}
    disabled={context.disabled}
    aria-label="Position of {context.itemLabel(item)}"
    value={index + 1}
    onkeydown={(event) => context.position.onkeydown(event, itemKey)}
    onblur={(event) => context.position.onblur(event, itemKey)}
  />

  <div class="content">
    {@render children?.()}
  </div>
</div>

<style>
  .ds.reorderable-list-item {
    display: flex;
    align-items: center;
    gap: var(--dimension-100);
    padding-block: var(--dimension-050);
    flex: 1;
    border-bottom: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);

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

      &:not(:disabled):hover {
        background-color: var(--color-foreground-input-hover);
      }
    }

    :global(.handle) {
      touch-action: none;
      --color-background-button-hover: var(--color-background-button);
      --color-background-button-active: var(--color-background-button);

      &:not(:disabled) {
        cursor: grab;
      }
    }

    > .content {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
</style>
