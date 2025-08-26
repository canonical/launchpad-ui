<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import MulticolorIcon from "./MulticolorIcon.svelte";
  import { iconNames } from "./iconNames.js";

  const { Story } = defineMeta({
    title: "Components/MulticolorIcon",
    tags: ["autodocs"],
    component: MulticolorIcon,
    argTypes: {
      name: {
        control: { type: "select" },
        options: [...iconNames].sort((a, b) => a.localeCompare(b)),
      },
    },
  });
</script>

<Story name="Default" args={{ name: "error" }} />

<Story name="All icons" argTypes={{ name: { table: { disable: true } } }}>
  {#snippet template({ name: _, ...args })}
    {#each iconNames as name (name)}
      <div style="display: flex; align-items: center; gap: 8px;">
        <MulticolorIcon {name} {...args} />
        {name}
      </div>
    {/each}
  {/snippet}
</Story>
