<!-- `SidePanel` component provides a mechanism to display content in a dialog overlay. To see an example of how to compose it with `ModalContent` see [SidePanel pattern](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/patterns-sidepanel--docs). -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import SidePanel from "./SidePanel.svelte";
  import type { SidePanelMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/SidePanel",
    tags: ["autodocs"],
    component: SidePanel,
    argTypes: {
      trigger: {
        control: false,
      },
      children: {
        control: false,
      },
    },
  });

  let sidePanel = $state<SidePanelMethods>();
  let timeLeft = $state(0);
  const onclick = () => {
    if (!sidePanel) return;
    sidePanel.show();
    timeLeft = 5;
    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        sidePanel?.close();
        clearInterval(interval);
      }
    }, 1000);
  };
</script>

<Story name="Default">
  {#snippet template({ children: _, trigger: __, ...args })}
    <SidePanel {...args}>
      {#snippet trigger(popovertarget, show)}
        <Button {popovertarget} onclick={show}>Show SidePanel</Button>
      {/snippet}
      {#snippet children(popovertarget, close)}
        <div style="padding: 1rem;">
          <p>This is the side panel content.</p>
          <Button {popovertarget} onclick={close}>Close</Button>
        </div>
      {/snippet}
    </SidePanel>
  {/snippet}
</Story>

<Story
  name="Controlled via instance methods"
  args={{ closeOnOutsideClick: false }}
>
  {#snippet template({ children: __, trigger: _, ...args })}
    <!-- 
    let sidePanel = $state<SidePanelMethods>();
    let timeLeft = $state(0);
    const onclick = () => {
      if (!sidePanel) return;
      sidePanel.show();
      timeLeft = 5;
      const interval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          sidePanel?.close();
          clearInterval(interval);
        }
      }, 1000);
    };
    -->

    <Button {onclick}>Some button</Button>
    <SidePanel bind:this={sidePanel} {...args}>
      The side panel will close automatically in {timeLeft} seconds.
    </SidePanel>
  {/snippet}
</Story>
