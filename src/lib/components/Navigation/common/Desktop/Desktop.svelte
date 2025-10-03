<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { DesktopProps } from "./types.js";

  const componentCssClassName = "ds desktop";

  let {
    class: className,
    children,
    expanded = $bindable(),
    ...rest
  }: DesktopProps = $props();
</script>

<header class={[componentCssClassName, className]} {...rest}>
  Desktop
  {@render children?.()}
</header>

<!-- @component
`Desktop` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Desktop class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Desktop>
```
-->

<style>
  /* .ds.desktop {

  } */
</style>
