<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Button, useIsMounted } from "@canonical/svelte-ds-app-launchpad";
  import { DeleteIcon, DragIcon } from "@canonical/svelte-icons";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { moveItem } from "./activeViewsListState.js";
  import type { ActiveViewsListItem } from "./activeViewsListState.js";
  import type { ActiveViewsListProps } from "./types.js";
  import { enhance } from "$app/forms";

  let {
    items,
    action,
    label = "Active views",
    emptyText = "No active views selected yet.",
    onreorder,
    onremove,
    class: className,
    ...rest
  }: ActiveViewsListProps = $props();

  const id = $props.id();
  const headingId = `${id}-heading`;
  const isMounted = useIsMounted();
  const reorderable = $derived(isMounted.value);

  let dragOrder = $state<ActiveViewsListItem[] | null>(null);
  const order = $derived(dragOrder ?? items);
  let dragIndex = $state<number | null>(null);
  let reorderForm = $state<HTMLFormElement>();
  let reorderPending = false;

  const submitReorder = () => reorderForm?.requestSubmit();

  const handleDragStart = (index: number, id: string) => (event: DragEvent) => {
    if (!event.dataTransfer) return;

    dragIndex = index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (index: number) => (event: DragEvent) => {
    if (dragIndex === null) return;

    event.preventDefault();

    if (dragIndex === index) return;

    dragOrder = moveItem(order, dragIndex, index);
    dragIndex = index;
  };

  const handleDrop = (event: DragEvent) => {
    if (dragIndex === null) return;
    event.preventDefault();
    dragIndex = null;
    if (!dragOrder) return;

    if (action) {
      reorderPending = true;
      submitReorder();
    } else {
      onreorder?.(dragOrder);
      dragOrder = null;
    }
  };

  const handleDragEnd = () => {
    dragIndex = null;
    if (!reorderPending) dragOrder = null;
  };

  const enhanceReorder: SubmitFunction = () => {
    return async ({ update }) => {
      try {
        await update();
      } finally {
        reorderPending = false;
        dragOrder = null;
      }
    };
  };
</script>

{#snippet deleteButton(itemLabel: string, onclick?: () => void)}
  <Button
    type={onclick ? "button" : "submit"}
    severity="base"
    aria-label="Remove {itemLabel}"
    {onclick}
  >
    {#snippet iconLeft()}
      <DeleteIcon />
    {/snippet}
  </Button>
{/snippet}

<section
  class={['active-views-list', className]}
  aria-labelledby={headingId}
  data-testid="active-views-list"
  {...rest}
>
  <h3 class="title" id={headingId}>{label}</h3>
  {#if order.length}
    <ul class="items" role="list">
      {#each order as item, index (item.id)}
        <li
          class="item"
          draggable={reorderable}
          ondragstart={handleDragStart(index, item.id)}
          ondragover={handleDragOver(index)}
          ondrop={handleDrop}
          ondragend={handleDragEnd}
        >
          <span class="handle" class:disabled={!reorderable} aria-hidden="true">
            <DragIcon />
          </span>
          <span class="text">{item.text}</span>
          {#if action}
            <form method="POST" {action} use:enhance class="remove-form">
              <input type="hidden" name="remove" value={item.id} />
              {@render deleteButton(item.text)}
            </form>
          {:else}
            {@render deleteButton(item.text, () => onremove?.(item.id))}
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">{emptyText}</p>
  {/if}
</section>

{#if action}
<form
  method="POST"
  {action}
  bind:this={reorderForm}
  use:enhance={enhanceReorder}
  hidden
>
  <input type="hidden" name="intent" value="reorder" />
  <input
    type="hidden"
    name="order"
    value={order.map((item) => item.id).join(",")}
  />
</form>
{/if}

<!-- @component
A reorderable active views list with drag-and-drop support and per-item removal.

**With `action`:** form-based removal and reorder are POSTed to a SvelteKit
form action via `use:enhance` (progressive enhancement; works without JS for removal).

**Without `action`:** purely client-side therefore use `onreorder` and `onremove` callbacks
to react to changes.
-->

<style>
  .active-views-list {
    display: flex;
    flex-direction: column;
    gap: var(--lp-dimension-spacing-block-xs);
  }

  .title {
    font: var(--lp-typography-paragraph-s-strong);
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: var(--lp-dimension-spacing-block-xxs);
    list-style: none;
  }

  .remove-form {
    display: contents;
  }

  .item {
    display: flex;
    gap: var(--lp-dimension-spacing-inline-s);
    align-items: center;
  }

  .text {
    flex: 1 1 auto;
    font: var(--lp-typography-paragraph-s);
  }

  .handle {
    display: inline-flex;
    cursor: grab;
  }

  .handle.disabled {
    cursor: default;
    opacity: var(--lp-opacity-muted, 0.5);
  }

  .empty {
    font: var(--lp-typography-paragraph-s);
    color: var(--lp-color-text-inactive);
  }
</style>
