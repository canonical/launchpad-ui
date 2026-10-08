<script module lang="ts">
  import { MODIFIER_FAMILIES } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Meter } from "./index.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/Meter",
    tags: ["autodocs"],
    component: Meter,
    args: { min: 0, max: 100, value: 50 },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <Meter {...args} />
  {/snippet}
</Story>

<Story
  name="Criticalities"
  argTypes={{
    criticality: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
    value: { table: { disable: true } },
  }}
>
  {#snippet template(args)}
    {#each [undefined, ...MODIFIER_FAMILIES.criticality] as criticality, index (criticality)}
      <div class="row">
        <Meter {...args} value={(index + 1) * 20} {criticality} />
        {criticality ?? "default"}
      </div>
    {/each}
  {/snippet}
</Story>
