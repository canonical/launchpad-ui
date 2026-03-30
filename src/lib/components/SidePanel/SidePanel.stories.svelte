<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import type { SidePanelMethods } from "./types.js";
  import { SidePanel } from "./index.js";

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
    sidePanel.showModal();
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
      {#snippet trigger(triggerProps)}
        <Button {...triggerProps}>Show SidePanel</Button>
      {/snippet}
      {#snippet children(commandfor)}
        <SidePanel.Content>
          <SidePanel.Content.Header>
            Discard pending review?
            <SidePanel.Content.Header.CloseButton
              {commandfor}
              command="close"
            />
          </SidePanel.Content.Header>
          <SidePanel.Content.Body>
            You have added 4 comments. Discarding the pending review will
            permanently delete them. Are you sure you want to continue?
          </SidePanel.Content.Body>
        </SidePanel.Content>
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
      sidePanel.showModal();
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
