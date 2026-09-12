<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { DeleteIcon, EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ReorderableList } from "./index.js";

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
      {#snippet item(props)}
        {#if props.item.expanded}
          <div class="custom-content">
            <span>Custom content for {props.item.name}</span>
            <Button onclick={() => (props.item.expanded = false)}>Close</Button>
          </div>
        {:else}
          <ReorderableList.Item {...props}>
            <span style="margin-inline-end: auto;">{props.item.name}</span>
            {#if props.item.editable}
              <Button
                density="dense"
                severity="base"
                aria-label="Edit {props.item.name}"
                onclick={() => (props.item.expanded = !props.item.expanded)}
              >
                {#snippet iconLeft()}
                  <EditIcon />
                {/snippet}
              </Button>
              <Button
                density="dense"
                severity="base"
                aria-label="Delete {props.item.name}"
                onclick={() =>
                  (items = items.filter((i) => i.id !== props.item.id))}
              >
                {#snippet iconLeft()}
                  <DeleteIcon />
                {/snippet}
              </Button>
            {/if}
          </ReorderableList.Item>
        {/if}
      {/snippet}
    </ReorderableList>
  {/snippet}
</Story>

<Story name="Status announcement" tags={["!autodocs"]}>
  {#snippet template(args)}
    {let items = $state(baseItems)}
    <div class="status-debug">
      <ReorderableList
        {...args}
        bind:items
        key={(item) => item.id}
        itemLabel={(item) => item.name}
      >
        {#snippet item(props)}
          <ReorderableList.Item {...props}>
            {props.item.name}
          </ReorderableList.Item>
        {/snippet}
      </ReorderableList>
    </div>
  {/snippet}
</Story>

<style>
  .custom-content {
    margin-top: var(--dimension-050);
    display: grid;
    place-content: center;
    justify-items: center;
    gap: var(--dimension-050);
    border: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);
    min-block-size: 10rem;
  }

  .status-debug :global([role="status"]) {
    position: static;
    width: auto;
    height: auto;
    margin: var(--dimension-200) 0 0;
    padding: var(--dimension-050);
    overflow: visible;
    clip: auto;
    clip-path: none;
    white-space: normal;
    border: var(--dimension-stroke-thickness-medium) solid
      var(--color-border-muted);
  }
</style>
