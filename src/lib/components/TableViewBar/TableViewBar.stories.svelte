<script lang="ts" module>
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TableViewBar from "./TableViewBar.svelte";

  const { Story } = defineMeta({
    title: "Components/TableViewBar",
    component: TableViewBar,
    tags: ["autodocs"],
    args: {
      label: "Package views",
      items: [
        { key: "all", text: "All packages", href: "?" },
        {
          key: "signed-by-me",
          text: "Signed by me",
          href: "?view=signed-by-me",
        },
        {
          key: "maintained-by-me",
          text: "Maintained by me",
          href: "?view=maintained-by-me",
        },
        { key: "my-uploads", text: "My uploads", href: "?view=my-uploads" },
        {
          key: "latest-uploads",
          text: "Latest uploads",
          href: "?view=latest-uploads",
        },
        {
          key: "ubuntu-server",
          text: "Ubuntu server",
          href: "?view=ubuntu-server",
        },
      ],
      current: "all",
    },
    argTypes: {
      trailing: { control: false },
    },
  });
</script>

<Story name="Default">
  {#snippet template({ trailing: _, items, current, ...args })}
    {let selected = $derived(current)}
    <TableViewBar
      current={selected}
      items={items.map((item) => ({
        ...item,
        // onclick handler for demonstration purposes only
        onclick: (event) => {
          event.preventDefault();
          selected = item.key;
        },
      }))}
      {...args}
    >
      {#snippet trailing()}
        <Button severity="base">
          {#snippet iconLeft()}
            <SettingsIcon />
          {/snippet}
        </Button>
      {/snippet}
    </TableViewBar>
  {/snippet}
</Story>

<Story name="Dynamic items">
  {#snippet template({ trailing: _, items, current, ...args })}
    {let selected = $derived(current)}
    {let added = $state(0)}
    <div
      style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-block-end: 1rem;"
    >
      <Button
        onclick={() => {
          added++;
          items.push({
            key: `added-${added}`,
            text:
              added % 2 ? `Added ${added}` : `A much longer added tab ${added}`,
            href: `?view=added-${added}`,
          });
        }}>Add</Button
      >
      <Button onclick={() => items.shift()}>Remove first</Button>
      <Button onclick={() => items.pop()}>Remove last</Button>
      <Button onclick={() => items.sort(() => Math.random() - 0.5)}
        >Shuffle</Button
      >
    </div>
    <div
      style="resize: horizontal; overflow: hidden; min-inline-size: 5rem; padding-block-end: 1rem;"
    >
      <TableViewBar
        current={selected}
        items={items.map((item) => ({
          ...item,
          // onclick handler for demonstration purposes only
          onclick: (event) => {
            event.preventDefault();
            selected = item.key;
          },
        }))}
        {...args}
      >
        {#snippet trailing()}
          <Button severity="base">
            {#snippet iconLeft()}
              <SettingsIcon />
            {/snippet}
          </Button>
        {/snippet}
      </TableViewBar>
    </div>
  {/snippet}
</Story>
