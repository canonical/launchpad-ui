<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { IconTextProps } from "./types.js";

  const componentCssClassName = "ds icon-text";

  let {
    class: className,
    modifiers,
    children,
    icon,
    ...rest
  }: IconTextProps = $props();
</script>

<span
  class={[componentCssClassName, className, modifiers]}
  data-testid="icon-text"
  {...rest}
>
  <span class="icon">
    {@render icon?.()}
  </span>
  <span class="text">
    {@render children?.()}
  </span>
</span>

<!-- @component
`IconText` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<IconText class="custom-class" id="unique-id">
  <p>Content goes here</p>
</IconText>
```
-->

<style>
  .ds.icon-text {
    --typography-font-size-icon-text: var(
      --typography-font-size-context,
      var(--tmp-typography-font-size-m)
    );
    --dimension-gap-icon-text: var(
      --dimension-gap-context,
      var(--tmp-dimension-spacing-inline-xs)
    );
    --color-text-icon-text: var(
      --tmp-color-text-context,
      var(--tmp-color-text-default)
    );
    --color-icon-icon-text: var(
      --tmp-color-icon-context,
      var(--tmp-color-text-context, var(--tmp-color-text-default))
    );
    display: inline-flex;
    align-items: center;
    gap: var(--dimension-gap-icon-text);
    font-size: var(--typography-font-size-icon-text);

    .icon {
      display: inline-flex;
      color: var(--color-icon-icon-text);
    }

    .text {
      display: inline-flex;
      color: var(--color-text-icon-text);
    }
  }
</style>
