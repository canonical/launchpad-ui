<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { DeleteIcon, EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ReorderableList from "./ReorderableList.svelte";

  type Item = {
    id: string;
    name: string;
    editable: boolean;
    expanded: boolean;
  };

  const { Story } = defineMeta({
    title: "Components/ReorderableList",
    tags: ["autodocs"],
    component: ReorderableList,
    argTypes: {
      items: { control: false },
      item: { control: false },
      extraContent: { control: false },
      key: { control: false },
      itemLabel: { control: false },
    },
  });
</script>

<script lang="ts">
  const baseItems: Item[] = [
    { id: "all", name: "All packages", editable: false, expanded: false },
    { id: "signed", name: "Signed by me", editable: true, expanded: false },
    {
      id: "maintained",
      name: "Maintained by me",
      editable: true,
      expanded: false,
    },
    {
      id: "lib",
      name: '"lib" + Resolute + changed by ubuntu',
      editable: true,
      expanded: false,
    },
    {
      id: "favorite",
      name: "Favorite packages",
      editable: true,
      expanded: false,
    },
    { id: "recent", name: "Recently viewed", editable: true, expanded: false },
  ];
</script>

<Story name="Default">
  {#snippet template(args)}
    {let items = $state(baseItems)}
    <ReorderableList
      {...args}
      bind:items
      key={(item) => item.id}
      itemLabel={(item) => item.name}
    >
      {#snippet item(item)}
        <div style="display: flex; align-items: center;">
          <span style="margin-inline-end: auto;">{item.name}</span>
          {#if item.editable}
            <Button
              density="dense"
              severity="base"
              aria-label="Edit {item.name}"
              onclick={() => (item.expanded = !item.expanded)}
            >
              {#snippet iconLeft()}
                <EditIcon />
              {/snippet}
            </Button>
            <Button
              density="dense"
              severity="base"
              aria-label="Delete {item.name}"
              onclick={() => (items = items.filter((i) => i.id !== item.id))}
            >
              {#snippet iconLeft()}
                <DeleteIcon />
              {/snippet}
            </Button>
          {/if}
        </div>
      {/snippet}
      {#snippet extraContent(item)}
        {#if item.expanded}
          <div
            style="margin-top: var(--dimension-050); display: grid; place-items: center; border: var(--dimension-stroke-thickness-medium) solid var(--color-border-muted); min-block-size: 10rem;"
          >
            Extra content for {item.name}
          </div>
        {/if}
      {/snippet}
    </ReorderableList>
  {/snippet}
</Story>
