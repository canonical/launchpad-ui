<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { ContextualMenuProps } from "./types.js";

  const componentCssClassName = "ds contextual-menu-content";

  let {
    class: className,
    children,
    helper,
    ...rest
  }: ContextualMenuProps = $props();

  const helperId = $props.id();
</script>

<div
  class={[componentCssClassName, className]}
  aria-describedby={helper ? helperId : undefined}
  data-testid="contextual-menu-content"
  {...rest}
>
  {@render children?.()}
  {@render helper?.(helperId)}
</div>

<!-- @component
`ContextualMenuContent` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ContextualMenuContent class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ContextualMenuContent>
```
-->

<style>
  .ds.contextual-menu-content {
    --border-contextual-menu-content: var(--dimension-stroke-thickness-default)
      solid var(--tmp-color-border-high-contrast);

    border: var(--border-contextual-menu-content);
  }
</style>
