<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { modifiersValues } from "$lib/modifiers";
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
  class={[componentCssClassName, className, modifiersValues(modifiers)]}
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
`IconText` displays text alongside an icon in a inline layout.

## Example Usage
```svelte
<IconText modifiers={{ size: "small", approval: "approved" }}>
  {#snippet icon()}
    <Success />
  {/snippet}
  Approved
</IconText>
```
-->

<style>
  .ds.icon-text {
    --typography-font-size-icon-text: var(
      --typography-font-size-context,
      var(--tmp-typography-font-size-m)
    );
    --typography-font-weight-icon-text: var(--tmp-typography-weight-regular);
    --typography-font-family-icon-text: var(
      --tmp-typography-font-family-default
    );
    --dimension-gap-icon-text: var(
      --dimension-gap-context,
      var(--tmp-dimension-spacing-inline-s)
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
    font-weight: var(--typography-font-weight-icon-text);
    font-family: var(--typography-font-family-icon-text);

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
