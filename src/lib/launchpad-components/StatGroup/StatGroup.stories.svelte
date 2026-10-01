<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { StatGroup } from "../index.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/StatGroup",
    tags: ["autodocs"],
    component: StatGroup,
    argTypes: {
      children: { control: false },
    },
  });
</script>

{#snippet buildStats()}
  <StatGroup.Stat>
    <StatGroup.Term>Images built</StatGroup.Term>
    <StatGroup.Description>35/41</StatGroup.Description>
    <StatGroup.Term>Failed to build</StatGroup.Term>
    <StatGroup.Description>
      <span class="status"><span class="dot"></span>2</span>
    </StatGroup.Description>
    <StatGroup.Term>Building</StatGroup.Term>
    <StatGroup.Description>4</StatGroup.Description>
  </StatGroup.Stat>
  <StatGroup.Stat>
    <StatGroup.Term>Images passed tests</StatGroup.Term>
    <StatGroup.Description>22/35</StatGroup.Description>
    <StatGroup.Term>Failed tests</StatGroup.Term>
    <StatGroup.Description>
      <span class="status"><span class="dot"></span>3</span>
    </StatGroup.Description>
    <StatGroup.Term>Testing</StatGroup.Term>
    <StatGroup.Description>10</StatGroup.Description>
  </StatGroup.Stat>
  <StatGroup.Stat>
    <StatGroup.Term>Open critical bugs</StatGroup.Term>
    <StatGroup.Description>
      <span><span class="dot"></span>1</span>
    </StatGroup.Description>
    <StatGroup.Term>Open bugs</StatGroup.Term>
    <StatGroup.Description>58</StatGroup.Description>
    <StatGroup.Term>In progress</StatGroup.Term>
    <StatGroup.Description>16</StatGroup.Description>
  </StatGroup.Stat>
  <StatGroup.Stat>
    <StatGroup.Term>Source packages</StatGroup.Term>
    <StatGroup.Description>41,992</StatGroup.Description>
    <StatGroup.Term>Binary packages</StatGroup.Term>
    <StatGroup.Description>100,472</StatGroup.Description>
  </StatGroup.Stat>
{/snippet}

<Story name="Default" >
  {#snippet template({ children: _, ...args })}
    <StatGroup {...args}>
      {@render buildStats()}
    </StatGroup>
  {/snippet}
</Story>

<Story name="Just a Stat" >
  {#snippet template({ children: _, ...args })}
    <StatGroup.Stat>
    <StatGroup.Term>Source packages</StatGroup.Term>
    <StatGroup.Description>41,992</StatGroup.Description>
    <StatGroup.Term>Binary packages</StatGroup.Term>
    <StatGroup.Description>100,472</StatGroup.Description>
  </StatGroup.Stat>
  {/snippet}
</Story>

<style>
  .status {
    display: flex;
    align-items: center;
    gap: var(--dimension-050);
  }

  .dot {
    width: 8px;
    height: 8px;
  border-radius: 50%;
    background: var(--color-icon-error, #B61928);
  }

  .parent-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--lp-dimension-spacing-inline-l);
  }

  .external {
    color: var(--lp-color-text-muted);
    font: var(--lp-typography-paragraph-default);
  }
</style>
