<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { MobileProps } from "./types.js";

  const componentCssClassName = "ds mobile";

  let { class: className, children, ...rest }: MobileProps = $props();
</script>

<header class={[componentCssClassName, className]} {...rest}>
  Mobile
  {@render children?.()}
</header>

<!-- @component
`Mobile` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Mobile class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Mobile>
```
-->

<style>
  .ds.mobile {
  }
</style>
