<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import AddCanvas from "./components/AddCanvas.svelte";
  import * as icons from "./components/index.js";

  const { Story } = defineMeta({
    title: "Components/Icons",
    tags: ["autodocs"],
    component: AddCanvas,
  });
</script>

<Story name="Default" />

<Story name="With custom color" args={{ style: "color: #ff6347;" }} />

<Story name="Of different sizes">
  {#snippet template(args)}
    {#each { length: 6 } as _, i (i)}
      {@const el = `h${i + 1}`}
      <svelte:element
        this={el}
        style="display: flex; align-items: center; gap: 8px;"
      >
        AddCanvas in <code>{el}</code>
        <AddCanvas {...args} />
      </svelte:element>
    {/each}
  {/snippet}
</Story>

<Story name="All icons">
  {#snippet template(args)}
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"
    >
      {#each Object.entries(icons) as [name, Icon] (name)}
        <div style="display: flex; align-items: center; gap: 8px;">
          <Icon {...args} />
          {name}
        </div>
      {/each}
    </div>
  {/snippet}
</Story>
