<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Snippet } from "svelte";
  import { Button } from "$lib/components/Button/index.js";
  import Modal from "./Modal.svelte";
  import type { ModalMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/Modal",
    tags: ["autodocs"],
    component: Modal,
    argTypes: {
      trigger: {
        control: false,
      },
      footer: {
        control: false,
      },
      children: {
        description: "Main content of the modal.",
        table: {
          type: { summary: "Snippet<[]>" },
        },
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

<Story
  name="Default"
  args={{
    header: "Discard pending review?" as unknown as Snippet,
    children:
      "You have added 4 comments. Discarding the pending review will permanently delete them. Are you sure you want to continue?" as unknown as Snippet,
  }}
>
  {#snippet template({ trigger: _, ...args })}
    <Modal {...args}>
      {#snippet trigger(popovertarget, showModal)}
        <Button {popovertarget} onclick={showModal}>Show Modal</Button>
      {/snippet}
      {#snippet footer(popovertarget, close)}
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
      {/snippet}
    </Modal>
  {/snippet}
</Story>

<Story
  name="Controlled via instance methods"
  args={{ closeOnOutsideClick: false, withCloseButton: false }}
  argTypes={{ children: { control: false } }}
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
