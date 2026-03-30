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
      {#snippet trigger(triggerProps)}
        <Button {...triggerProps}>Show Modal</Button>
      {/snippet}
      {#snippet children(commandfor, close)}
        <Modal.Content>
          <Modal.Content.Header>
            Discard pending review?
            <Modal.Content.Header.CloseButton {commandfor} command="close" />
          </Modal.Content.Header>
          <Modal.Content.Body>
            You have added 4 comments. Discarding the pending review will
            permanently delete them. Are you sure you want to continue?
          </Modal.Content.Body>
          <Modal.Content.Footer>
            <Button {commandfor} command="close">Keep review</Button>
            <Button
              onclick={() => {
                // doSomething();
                close();
              }}
              severity="negative"
            >
              Discard review
            </Button>
          </Modal.Content.Footer>
        </Modal.Content>
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
