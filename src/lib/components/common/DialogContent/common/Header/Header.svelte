<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { HeaderProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds dialog-content-header";

  let { class: className, children, ...rest }: HeaderProps = $props();
</script>

<header class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</header>

<!-- @component
`DialogContent.Header` represents the header section of a dialog.

## Example Usage
```svelte
<DialogContent.Header>
  Header Content
  <DialogContent.Header.CloseButton />
</DialogContent.Header>
```
-->
