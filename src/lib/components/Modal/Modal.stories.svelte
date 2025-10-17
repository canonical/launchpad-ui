<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import { ModalContent } from "$lib/components/ModalContent/index.js";
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

<!-- `Modal` component provides a mechanism to display content in a dialog overlay. This Story composes it with the [`ModalContent` component](?path=/docs/components-modalcontent--docs) to create a confirmation dialog. -->

<Story name="With ModalContent">
  {#snippet template({ children: _, trigger: __, ...args })}
    <Modal {...args}>
      {#snippet trigger(triggerProps)}
        <Button {...triggerProps}>Show Modal</Button>
      {/snippet}
      {#snippet children(popovertarget, close)}
        <ModalContent>
          <ModalContent.Header>
            Discard pending review?
            <ModalContent.Header.CloseButton {popovertarget} onclick={close} />
          </ModalContent.Header>
          <ModalContent.Body>
            You have added 4 comments. Discarding the pending review will
            permanently delete them. Are you sure you want to continue?
          </ModalContent.Body>
          <ModalContent.Footer>
            <Button {popovertarget} onclick={close}>Keep review</Button>
            <Button
              {popovertarget}
              onclick={() => {
                // doSomething();
                close();
              }}
              modifiers={{ severity: "negative" }}
            >
              Discard review
            </Button>
          </ModalContent.Footer>
        </ModalContent>
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
