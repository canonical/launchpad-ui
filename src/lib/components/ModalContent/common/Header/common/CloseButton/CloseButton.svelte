<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Close } from "@canonical/svelte-icons";
  import { Button } from "$lib/components/Button/index.js";
  import type { CloseButtonProps } from "./types.js";

  const componentCssClassName = "ds modal-content-close-button";

  let {
    class: className,
    severity: _severity,
    ...rest
  }: CloseButtonProps = $props();
</script>

<Button
  class={[componentCssClassName, className]}
  aria-label="Close"
  severity="base"
  {...rest}
>
  {#snippet iconLeft()}
    <Close />
  {/snippet}
</Button>

<!-- @component
`ModalContent.Header.CloseButton` is a wrapper over `Button` meant to be used as a close button in modal headers.

## Example Usage
```svelte
<ModalContent.Header.CloseButton onclick={handleClose} />
```
-->
