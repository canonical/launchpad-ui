<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { ModalContentProps } from "./types.js";

  const componentCssClassName = "ds modal-content";

  let { class: className, children, ...rest }: ModalContentProps = $props();
</script>

<section
  class={[componentCssClassName, className]}
  data-testid="modal-content"
  {...rest}
>
  {@render children?.()}
</section>

<!-- @component
`ModalContent` is a layout component that provides a structured container for modal-like content.

## Example Usage
```svelte
  <ModalContent>
    <ModalContent.Header>
      Modal Header
      <ModalContent.Header.CloseButton />
    </ModalContent.Header>
    <ModalContent.Body>
      Main Content
    </ModalContent.Body>
    <ModalContent.Footer>
      <Button>Footer Button</Button>
      <Button>Footer Button</Button>
    </ModalContent.Footer>
  </ModalContent>
```
-->

<style>
  .ds.modal-content {
    --border-modal-content: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-high-contrast);
    --color-background-modal-content: var(--tmp-color-background-default);
    --dimension-gap-modal-content: var(--tmp-dimension-spacing-block-m);
    --dimension-padding-block-modal-content: var(
      --tmp-dimension-spacing-block-l
    );
    --dimension-padding-inline-modal-content: var(
      --tmp-dimension-spacing-inline-l
    );

    display: flex;
    flex-direction: column;
    gap: var(--dimension-gap-modal-content);

    background-color: var(--color-background-modal-content);
    border: var(--border-modal-content);
    padding-block: var(--dimension-padding-block-modal-content);
    padding-inline: var(--dimension-padding-inline-modal-content);
  }
</style>
