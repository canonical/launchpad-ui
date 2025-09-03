<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { HeaderProps } from "./types.js";

  const componentCssClassName = "ds modal-content-header";

  let { class: className, children, ...rest }: HeaderProps = $props();
</script>

<header
  class={[componentCssClassName, className]}
  data-testid="modal-content-header"
  {...rest}
>
  {@render children?.()}
</header>

<!-- @component
`ModalContent.Header` represents the header section of a modal.

## Example Usage
```svelte
<ModalContent.Header>
  Header Content
  <ModalContent.Header.CloseButton />
</ModalContent.Header>
```
-->

<style>
  .ds.modal-content-header {
    --typography-modal-content-header: var(--tmp-typography-h4);

    display: flex;
    justify-content: space-between;
    align-items: baseline;
    text-wrap: balance;

    font: var(--typography-modal-content-header);

    > :global(.ds.modal-content-close-button) {
      margin-inline-start: auto;
    }
  }
</style>
