<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Icon from "./Icon.svelte";
  import { iconNames } from "./iconNames.js";

  const { Story } = defineMeta({
    title: "Components/Icon",
    tags: ["autodocs"],
    component: Icon,
    argTypes: {
      name: {
        control: { type: "select" },
        options: [...iconNames].sort((a, b) => a.localeCompare(b)),
      },
    },
  });
</script>

<Story name="Default" args={{ name: "edit" }} />

<Story
  name="With custom color"
  args={{ name: "edit", style: "color: #ff6347;" }}
/>

<Story name="All icons" argTypes={{ name: { table: { disable: true } } }}>
  {#snippet template({ name: _, ...args })}
    {#each iconNames as name (name)}
      <div style="display: flex; align-items: center; gap: 8px;">
        <Icon {name} {...args} />
        {name}
      </div>
    {/each}
  {/snippet}
</Story>
