<script module lang="ts">
  import { ChevronDownIcon, ChevronUpIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import type { ToggleEventHandler } from "svelte/elements";
  import { Button } from "$lib/components/Button/index.js";
  import Popover from "./Popover.svelte";
  import type { PopoverMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/Popover",
    tags: ["autodocs"],
    component: Popover,
    argTypes: {
      trigger: {
        control: false,
      },
    },
    args: {
      children: "This is the content of the popover." as unknown as Snippet,
    },
  });

  let popover = $state<PopoverMethods>();
  let timeLeft = $state(0);
  const ontoggle: ToggleEventHandler<HTMLDivElement> = (e) => {
    if (e.newState === "open") {
      timeLeft = 5;
      const interval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          popover?.hidePopover();
          clearInterval(interval);
        }
      }, 1000);
    }
  };
</script>

<Story name="Default">
  {#snippet template({ trigger: _, ...args })}
    <Popover {...args}>
      {#snippet trigger(triggerProps, open)}
        <Button {...triggerProps}>
          {open ? "Close Popover" : "Open Popover"}
          {#snippet iconRight()}
            {#if open}
              <ChevronDownIcon />
            {:else}
              <ChevronUpIcon />
            {/if}
          {/snippet}
        </Button>
      {/snippet}
    </Popover>
  {/snippet}
</Story>

<Story
  name="Imperatively controlled"
  argTypes={{
    children: { control: false },
  }}
  args={{
    popover: "manual",
  }}
>
  {#snippet template({ children: _, trigger: __, ...args })}
    <!--
    <script lang="ts">
      let popover = $state<PopoverMethods>();
      let timeLeft = $state(0);
      const ontoggle: ToggleEventHandler<HTMLDivElement> = (e) => {
        if (e.newState === "open") {
          timeLeft = 5;
          const interval = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft <= 0) {
              popover?.hidePopover();
              clearInterval(interval);
            }
          }, 1000);
        }
      };
    </script>
    -->

    <Popover {...args} bind:this={popover} {ontoggle}>
      {#snippet trigger(triggerProps, open)}
        <Button {...triggerProps} disabled={open}>
          Open Popover
          {#snippet iconRight()}
            {#if open}
              <ChevronDownIcon />
            {:else}
              <ChevronUpIcon />
            {/if}
          {/snippet}
        </Button>
      {/snippet}
      This popover will close automatically in {timeLeft} seconds.
    </Popover>
  {/snippet}
</Story>

<Story
  name="With customized position"
  args={{ popover: "manual" }}
  argTypes={{
    position: { table: { disable: true } },
    children: { control: false },
  }}
>
  {#snippet template({ children: _, trigger: __, ...args })}
    <div
      style="display: grid; grid-template-columns: repeat(2, 1fr); place-items: center; gap: 4rem;"
    >
      {#each ["block-start span-inline-start", "block-end span-inline-start", "block-start span-inline-end", "block-end span-inline-end", "block-start", "block-end"] as const as position (position)}
        <Popover {...args} {position}>
          {#snippet trigger(triggerProps)}
            <Button {...triggerProps} {@attach (e) => e.click()}>Toggle</Button>
          {/snippet}
          I'm <code>{position}</code>!
        </Popover>
      {/each}
    </div>
  {/snippet}
</Story>

<Story
  name="Fallback positioned"
  tags={["!autodocs"]}
  argTypes={{ children: { control: false } }}
  args={{
    positionTryFallback: "flip-inline, flip-block",
    position: "block-end span-inline-end",
  }}
>
  {#snippet template({ children: _, trigger: __, ...args })}
    <div style="display: flex; justify-content: flex-end;">
      <Popover {...args}>
        {#snippet trigger(triggerProps)}
          <Button {...triggerProps}>Toggle</Button>
        {/snippet}
        <p style="width: min(400px, 100vw);">
          This is a wide popover content that could overflow the viewport on the
          inline-end side. Resize your window if it doesn't.
        </p>
      </Popover>
    </div>
  {/snippet}
</Story>
