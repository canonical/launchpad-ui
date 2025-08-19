<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
  import Badge from "./Badge.svelte";

  const { Story } = defineMeta({
    title: "Components/Badge",
    tags: ["autodocs"],
    component: Badge,
    argTypes: {
      value: { control: { type: "number", min: 0, step: 1 } },
    },
  });
</script>

<Story name="Default" args={{ value: 42 }} />

<Story
  name="Capped"
  argTypes={{ value: { table: { disable: true } } }}
  args={{ variant: "capped" }}
>
  {#snippet template(args)}
    <div class="row">
      {#each [0, 42, 999, 2100] as value (value)}
        <Badge {...args} {value} />
      {/each}
    </div>
  {/snippet}
</Story>

<Story
  name="Rounded"
  argTypes={{ value: { table: { disable: true } } }}
  args={{ variant: "rounded" }}
>
  {#snippet template(args)}
    <div class="row">
      {#each [0, 42, 999, 2100, 10_000, 251_110, 8_899_500, 1_111_111_111, 98_123_456_789_890] as value (value)}
        <Badge {...args} {value} />
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Severities" args={{ value: 42 }}>
  {#snippet template({ modifiers = [], ...args })}
    {#each [undefined, ...SEMANTIC_MODIFIERS.SEVERITY] as modifier (modifier)}
      <div class="row">
        <Badge {...args} modifiers={[modifier, ...modifiers]} />
        {modifier || "default"}
      </div>
      <br />
    {/each}
  {/snippet}
</Story>
