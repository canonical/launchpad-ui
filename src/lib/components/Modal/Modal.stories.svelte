<!-- `Modal` component provides a mechanism to display content in a dialog overlay. To see an example of how to compose it with `ModalContent` see [Modal pattern](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/patterns-modal--docs). -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import type { ModalMethods } from "./types.js";
  import { Modal } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Modal",
    tags: ["autodocs"],
    component: Modal,
    argTypes: {
      trigger: {
        control: false,
      },
      children: {
        control: false,
      },
    },
  });

  let modal = $state<ModalMethods>();
  let timeLeft = $state(0);
  const onclick = () => {
    if (!modal) return;
    modal.showModal();
    timeLeft = 5;
    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        modal?.close();
        clearInterval(interval);
      }
    }, 1000);
  };
</script>

<Story name="Default">
  {#snippet template({ children: _, trigger: __, ...args })}
    <Modal {...args}>
      {#snippet trigger(popovertarget, showModal)}
        <Button {popovertarget} onclick={showModal}>Show Modal</Button>
      {/snippet}
      {#snippet children(popovertarget, close)}
        <div style="padding: 1rem;">
          <p>This is the modal content.</p>
          <Button {popovertarget} onclick={close}>Close</Button>
        </div>
      {/snippet}
    </Modal>
  {/snippet}
</Story>

<Story
  name="Controlled via instance methods"
  args={{ closeOnOutsideClick: false }}
>
  {#snippet template({ children: __, trigger: _, ...args })}
    <!-- 
    let modal = $state<ModalMethods>();
    let timeLeft = $state(0);
    const onclick = () => {
      if (!modal) return;
      modal.showModal();
      timeLeft = 5;
      const interval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          modal?.close();
          clearInterval(interval);
        }
      }, 1000);
    };
    -->

    <Button {onclick}>Some button</Button>
    <Modal bind:this={modal} {...args}>
      The modal will close automatically in {timeLeft} seconds.
    </Modal>
  {/snippet}
</Story>
