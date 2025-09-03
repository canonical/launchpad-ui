<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Button } from "$lib/components/Button/index.js";
  import { Icon } from "$lib/components/Icon/index.js";
  import type { CloseButtonProps } from "./types.js";

  const componentCssClassName = "ds modal-content-close-button";

  let {
    class: className,
    modifiers: modifiersProp,
    ...rest
  }: CloseButtonProps = $props();
  const modifiers = $derived({
    severity: "base",
    ...modifiersProp,
  } as const);
</script>

<Button
  class={[componentCssClassName, className]}
  {modifiers}
  aria-label="Close"
  {...rest}
>
  {#snippet iconLeft()}
    <Icon name="close" />
  {/snippet}
</Button>

<!-- @component
`ModalContent.Header.CloseButton` is a wrapper over `Button` meant to be used as a close button in modal headers.

## Example Usage
```svelte
<ModalContent.Header.CloseButton onclick={handleClose} />
```
-->
