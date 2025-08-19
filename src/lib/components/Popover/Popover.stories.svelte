<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { ToggleEventHandler } from "svelte/elements";
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import Popover from "./Popover.svelte";
  import type { PopoverMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/Popover",
    tags: ["autodocs"],
    component: Popover,
    argTypes: {
      children: {
        control: false,
      },
      trigger: {
        control: false,
      },
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
  {#snippet template({ children: _, trigger: __, ...args })}
    <Popover {...args}>
      {#snippet trigger(popovertarget, open)}
        <Button {popovertarget}>
          {open ? "Close Popover" : "Open Popover"}
          {#snippet iconRight()}
            <Icon name={open ? "chevron-down" : "chevron-up"} />
          {/snippet}
        </Button>
      {/snippet}
      This is content of the popover.
    </Popover>
  {/snippet}
</Story>

<Story
  name="Imperatively controlled"
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
      {#snippet trigger(popovertarget, open)}
        <Button {popovertarget} disabled={open}>
          Open Popover
          {#snippet iconRight()}
            <Icon name={open ? "chevron-down" : "chevron-up"} />
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
  }}
>
  {#snippet template({ children: _, trigger: __, ...args })}
    <div
      style="display: grid; grid-template-columns: repeat(2, 1fr); place-items: center; gap: 4rem;"
    >
      {#each ["block-start span-inline-start", "block-end span-inline-start", "block-start span-inline-end", "block-end span-inline-end", "block-start span-all", "block-end span-all"] as const as position (position)}
        <Popover {...args} {position}>
          {#snippet trigger(popovertarget)}
            <Button {popovertarget} {@attach (e) => e.click()}>Toggle</Button>
          {/snippet}
          I'm <code>{position}</code>!
        </Popover>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Fallback positioned" tags={["!autodocs"]}>
  {#snippet template({ children: _, trigger: __, ...args })}
    <div style="display: flex; justify-content: flex-end;">
      <Popover {...args}>
        {#snippet trigger(popovertarget)}
          <Button {popovertarget}>Toggle</Button>
        {/snippet}
        <p style="width: min(400px, 100vw);">
          This is a wide popover content that could overflow the viewport on the
          inline-end side. Resize your window if it doesn't.
        </p>
      </Popover>
    </div>
  {/snippet}
</Story>
