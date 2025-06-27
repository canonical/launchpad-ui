<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { BoxProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds box";

  let { id, class: className, style, children }: BoxProps = $props();
</script>

<div class={[componentCssClassName, className]} {id} {style}>
  {@render children?.()}
</div>

<!-- @component
`Box` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Box class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Box>
```
-->
