<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button, Modal, ModalContent } from "$lib/components/index.js";

  const { Story } = defineMeta({
    tags: ["autodocs"],
    title: "Patterns/Modal",
  });
</script>

<!-- 
The following Modal example can be assembled using:
- [Modal](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-modal--docs)
- [ModalContent](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-modalcontent--docs)
- [Button](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-button--docs)
-->

<Story name="Modal" asChild>
  <Modal>
    {#snippet trigger(triggerProps)}
      <Button {...triggerProps}>Open modal</Button>
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
</Story>
