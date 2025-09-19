<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { Button } from "$lib/components/Button/index.js";
  import Tooltip from "./Tooltip.svelte";

  const { Story } = defineMeta({
    title: "Components/Tooltip",
    tags: ["autodocs"],
    component: Tooltip,
    argTypes: {
      trigger: {
        control: false,
      },
    },
    args: {
      children: "Hello there!" as unknown as Snippet,
    },
  });
</script>

<Story name="Default">
  {#snippet template({ trigger: _, ...args })}
    <div style="display: grid; place-items: center; min-height: 150px;">
      <Tooltip {...args}>
        {#snippet trigger(triggerProps)}
          <Button {...triggerProps}>Hover or focus me</Button>
        {/snippet}
      </Tooltip>
    </div>
  {/snippet}
</Story>

<Story
  name="With different positions"
  argTypes={{ position: { control: false } }}
  args={{ autoAdjust: false, delay: 0 }}
>
  {#snippet template({ trigger: _, position: __, ...args })}
    <div
      style="padding: 4rem; display: grid; grid-template-columns: repeat(2, 1fr); row-gap: 4rem; place-items: center; "
    >
      {#each ["block-start", "block-end", "block-start span-inline-start", "block-start span-inline-end", "block-end span-inline-start", "block-end span-inline-end", "inline-start", "inline-end"] as const as position (position)}
        <Tooltip {position} {...args}>
          {#snippet trigger(triggerProps)}
            <Button {...triggerProps}>{position}</Button>
          {/snippet}
        </Tooltip>
      {/each}
    </div>
  {/snippet}
</Story>

<Story
  name="With auto adjust"
  args={{
    position: "block-end span-inline-end",
    autoAdjust: true,
    delay: 0,
    children: "And now scroll the container" as unknown as Snippet,
  }}
>
  {#snippet template({ trigger: _, ...args })}
    <div
      class="placeholder-box"
      style="height: 250px; overflow: auto;"
      {@attach (el) => {
        el.scrollTo({ top: el.clientHeight / 2, left: el.clientWidth / 2 });
      }}
    >
      <div
        style="height: 200%; width: 200%; display: grid; place-items: center; position: relative;"
      >
        <Tooltip {...args}>
          {#snippet trigger(triggerProps)}
            <Button {...triggerProps}>Click me</Button>
          {/snippet}
        </Tooltip>
      </div>
    </div>
  {/snippet}
</Story>
