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
      var(--lp-typography-font-size-m)
    );
    --typography-font-weight-icon-text: var(--lp-typography-weight-regular);
    --typography-font-family-icon-text: var(
      --lp-typography-font-family-default
    );
    --dimension-gap-icon-text: var(
      --dimension-gap-context,
      var(--lp-dimension-spacing-inline-s)
    );
    --color-text-icon-text: var(
      --lp-color-text-context,
      var(--lp-color-text-default)
    );
    --color-icon-icon-text: var(
      --lp-color-icon-context,
      var(--lp-color-text-context, var(--lp-color-text-default))
    );
    display: inline-flex;
    align-items: center;
    gap: var(--dimension-gap-icon-text);
    font-size: var(--typography-font-size-icon-text);
    font-weight: var(--typography-font-weight-icon-text);
    font-family: var(--typography-font-family-icon-text);

    .icon {
      display: inline-flex;
      flex-shrink: 0;
      color: var(--color-icon-icon-text);
    }

    .text {
      display: inline-flex;
      color: var(--color-text-icon-text);
    }
  }
</style>
