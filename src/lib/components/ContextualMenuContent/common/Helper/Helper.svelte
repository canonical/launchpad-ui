<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { HelperProps } from "./types.js";

  const componentCssClassName = "ds helper";

  let { class: className, children, icon, ...rest }: HelperProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest} data-testid="helper">
  {@render icon?.()}
  {@render children()}
</div>

<!-- @component
`Helper` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Helper class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Helper>
```
-->

<style>
  .ds.helper {
    --color-background-helper: var(--tmp-color-background-default);
    --dimension-padding-inline-helper: var(--tmp-dimension-spacing-inline-m);
    --dimension-padding-block-helper: var(--tmp-dimension-spacing-block-xs);
    --border-top-helper: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-high-contrast);
    --dimension-gap-helper: var(--tmp-dimension-spacing-inline-xs);

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--dimension-gap-helper);

    background-color: var(--color-background-helper);
    padding-inline: var(--dimension-padding-inline-helper);
    padding-block: var(--dimension-padding-block-helper);
    border-top: var(--border-top-helper);
  }
</style>
