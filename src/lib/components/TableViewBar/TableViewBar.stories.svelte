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
      label: "Package views"
    },
    argTypes: {
      trailing: { control: false }
    }
  });
</script>

<Story
  name="Default"
  args={{
    items: [
      { text: "All packages", href: "?" },
      { text: "Signed by me", href: "?view=signed-by-me" },
      { text: "Maintained by me", href: "?view=maintained-by-me" },
      { text: "My uploads", href: "?view=my-uploads" },
      { text: "Latest uploads", href: "?view=latest-uploads" },
      { text: "Ubuntu server", href: "?view=ubuntu-server" },
    ],
  }}
>
  {#snippet template({ trailing: _, items, ...args })}
  {let selected = $state("All packages")}
    <TableViewBar 
      items={
        items.map((item) => ({
          ...item,
          current: item.text === selected,
          // onclick handler for demonstration purposes only
          onclick: (event) => {
            event.preventDefault();
            selected = item.text;
          }
        }))
      } {...args}>
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

<Story
  name="Dynamic items"
  args={{ items: [] }}
  argTypes={{ items: { control: false } }}
>
  {#snippet template({ trailing: _, items: __, ...args })}
    {const items = $state([
      { text: "All packages", href: "?" },
      { text: "Signed by me", href: "?view=signed-by-me" },
      { text: "Maintained by me", href: "?view=maintained-by-me" },
      { text: "My uploads", href: "?view=my-uploads" },
      { text: "Latest uploads", href: "?view=latest-uploads" },
      { text: "Ubuntu server", href: "?view=ubuntu-server" },
    ])}
    {let selected = $state("All packages")}
    {let added = $state(0)}
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-block-end: 1rem;">
      <Button
        onclick={() => {
          added++;
          items.push({
            text: added % 2 ? `Added ${added}` : `A much longer added tab ${added}`,
            href: `?view=added-${added}`,
          });
        }}>Add</Button
      >
      <Button onclick={() => items.shift()}>Remove first</Button>
      <Button onclick={() => items.pop()}>Remove last</Button>
      <Button
        onclick={() =>
          items.sort(() => Math.random() - 0.5)}>Shuffle</Button
      >
    </div>
    <div style="resize: horizontal; overflow: hidden; min-inline-size: 5rem; padding-block-end: 1rem;">
      <TableViewBar items={items.map((item) => ({
        ...item,
        current: item.text === selected,
        // onclick handler for demonstration purposes only
        onclick: (event) => {
          event.preventDefault();
          selected = item.text;
        }
      }))} {...args}>
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

