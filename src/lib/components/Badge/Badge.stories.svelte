<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SEMANTIC_MODIFIERS, modifiersControl } from "$lib/modifiers";
  import Badge from "./Badge.svelte";
  import { badgeModifiers } from "./modifiers";

  const { Story } = defineMeta({
    title: "Components/Badge",
    tags: ["autodocs"],
    component: Badge,
    argTypes: {
      value: { control: { type: "number", min: 0, step: 1 } },
      ...modifiersControl(badgeModifiers),
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
  {#snippet template({ ...args })}
    {#each [undefined, ...SEMANTIC_MODIFIERS.severity] as severity (severity)}
      <div class="row">
        <Badge {...args} modifiers={{ severity }} />
        {severity || "default"}
      </div>
      <br />
    {/each}
  {/snippet}
</Story>
