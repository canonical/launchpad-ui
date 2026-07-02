<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import {
    ActiveViewsList,
    addItem,
    moveItem,
    orderItems,
    removeItem,
    toggleItem,
  } from "./index.js";
  import type { ActiveViewsListItem } from "./index.js";

  const items: ActiveViewsListItem[] = [
    { id: "latest-uploads", text: "Latest uploads" },
    { id: "my-uploads", text: "My uploads" },
    { id: "ubuntu-server", text: "Ubuntu server" },
  ];

  const { Story } = defineMeta({
    title: "Components/ActiveViewsList",
    tags: ["autodocs"],
    component: ActiveViewsList,
    args: {
      items,
      label: "Active items",
    },
  });

  let defaultItems = $state<ActiveViewsListItem[]>([...items]);
  let interactive = $state<ActiveViewsListItem[]>([...items]);

  const addInteractiveItem = () => {
    const itemNumber = interactive.length + 1;
    interactive = addItem(interactive, {
      id: `item-${Date.now()}`,
      text: `New item ${itemNumber}`,
    });
  };

  const removeLastInteractiveItem = () => {
    const lastItemId = interactive.at(-1)?.id;
    interactive = lastItemId
      ? removeItem(interactive, lastItemId)
      : interactive;
  };

  const moveFirstInteractiveItemToEnd = () => {
    interactive = moveItem(interactive, 0, interactive.length - 1);
  };

  const reverseInteractiveItems = () => {
    interactive = orderItems(
      interactive,
      [...interactive].reverse().map((item) => item.id),
    );
  };

  const toggleMyUploads = () => {
    interactive = toggleItem(interactive, {
      id: "my-uploads",
      text: "My uploads",
    });
  };
</script>

<Story name="Default">
  {#snippet template({ ...args })}
    <ActiveViewsList
      {...args}
      items={defaultItems}
      onreorder={(newItems) => (defaultItems = newItems)}
      onremove={(id) => (defaultItems = removeItem(defaultItems, id))}
    />
  {/snippet}
</Story>

<Story name="Empty" args={{ items: [] }} />

<Story name="Using state helpers">
  {#snippet template({ items: _, ...args })}
    <!--
      The `activeViewsListState` module exports pure helper functions for
      manipulating the items array. Use them in your page logic or form
      actions to add, remove, reorder, or toggle items:

      ```ts
      import {
        addItem,
        removeItem,
        moveItem,
        toggleItem,
        orderItems,
      } from "$lib/components/ActiveViewsList";
      ```
    -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <ActiveViewsList
        {...args}
        items={interactive}
        onreorder={(newItems) => (interactive = newItems)}
        onremove={(id) => (interactive = removeItem(interactive, id))}
      />

      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button onclick={addInteractiveItem}>addItem(...)</Button>
        <Button onclick={removeLastInteractiveItem}>removeItem(last)</Button>
        <Button onclick={moveFirstInteractiveItemToEnd}>
          moveItem(first → last)
        </Button>
        <Button onclick={reverseInteractiveItems}>orderItems(reverse)</Button>
        <Button onclick={toggleMyUploads}>toggleItem("My uploads")</Button>
        <Button onclick={() => (interactive = [...items])}>Reset</Button>
      </div>
    </div>
  {/snippet}
</Story>
