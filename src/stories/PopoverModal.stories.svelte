<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button, ModalContent, Popover } from "$lib/components/index.js";

  const { Story } = defineMeta({
    tags: ["autodocs"],
    title: "Patterns/PopoverModal",
  });

  const code =
    "git clone -b <branch_name> https://git.launchpad.net/~<proposer_handle>/<repo_name>";
</script>

<!-- 
The following Popover Modal example can be assembled using:
- [Popover](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-popover--docs)
- [ModalContent](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-modalcontent--docs)
- [Button](https://main--689106f3797b06760a3c9414.chromatic.com/?path=/docs/components-button--docs)
-->

<Story name="PopoverModal" asChild>
  <Popover>
    {#snippet trigger(triggerProps)}
      <Button {...triggerProps}>Checkout</Button>
    {/snippet}
    {#snippet children(popovertarget)}
      <ModalContent style="max-width: 560px; margin-block-start: 2px;">
        <ModalContent.Header>
          Check out review locally
          <ModalContent.Header.CloseButton {popovertarget} />
        </ModalContent.Header>
        <ModalContent.Body>
          <code style="word-break: break-all;">
            {code}
          </code>
        </ModalContent.Body>
        <ModalContent.Footer>
          <Button>Copy</Button>
        </ModalContent.Footer>
      </ModalContent>
    {/snippet}
  </Popover>
</Story>
