<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { FooterProps } from "./types.js";

  const componentCssClassName = "ds modal-content-footer";

  let { class: className, children, ...rest }: FooterProps = $props();
</script>

<footer
  class={[componentCssClassName, className]}
  data-testid="modal-content-footer"
  {...rest}
>
  {@render children?.()}
</footer>

<!-- @component
`ModalContent.Footer` represents the footer section of a modal. Usually contains action buttons.

## Example Usage
```svelte
<ModalContent.Footer>
  <Button>Cancel</Button>
  <Button>Confirm</Button>
</ModalContent.Footer>
```
-->

<style>
  .ds.modal-content-footer {
    --dimension-gap-modal-content-footer: var(--tmp-dimension-spacing-inline-m);

    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;

    gap: var(--dimension-gap-modal-content-footer);
  }
</style>
