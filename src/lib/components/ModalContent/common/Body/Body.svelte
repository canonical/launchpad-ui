<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { BodyProps } from "./types.js";

  const componentCssClassName = "ds modal-content-body";

  let { class: className, children, ...rest }: BodyProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="modal-content-body"
  {...rest}
>
  {@render children?.()}
</div>

<!-- @component
`ModalContent.Body` represents the main content area of a modal.

## Example Usage
```svelte
<ModalContent.Body>
  Main Content
</ModalContent.Body>
```
-->

<style>
  .ds.modal-content-body {
    --typography-modal-content-body: var(--tmp-typography-paragraph-default);
    --color-text-modal-content-body: var(--tmp-color-text-default);

    font: var(--typography-modal-content-body);
    color: var(--color-text-modal-content-body);
  }
</style>
