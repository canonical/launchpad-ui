<!-- @canonical/generator-ds 0.10.0-experimental.0 -->
<script lang="ts" module>
  // TODO: Remove hardcoded locale when i18n implemented
  const displayValueFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });
</script>

<script lang="ts">
  import type { BadgeProps } from "./types.js";

  const componentCssClassName = "ds badge";

  const {
    class: className,
    value,
    variant = "capped",
    modifiers,
    ...rest
  }: BadgeProps = $props();

  const displayValue = $derived.by(() => {
    const nonNegativeInt = Math.round(Math.max(value, 0));

    if (variant === "capped") {
      return nonNegativeInt > 999 ? "999+" : nonNegativeInt;
    }

    return displayValueFormatter.format(nonNegativeInt);
  });
</script>

<span
  class={[componentCssClassName, className, modifiers]}
  data-testid="badge"
  {...rest}
>
  {displayValue}
</span>

<!-- @component
`Badge` is a visual indicator for numeric values. It is static and not interactive.

## Example Usage
```svelte
<Badge value={42} modifiers={["caution"]} />
<Badge value={2351} variant="rounded" />
```
-->

<style>
  .ds.badge {
    --color-background-badge: var(
      --tmp-color-background-context,
      var(--tmp-color-text-default)
    );
    --color-text-badge: var(
      --tmp-color-text-context,
      var(--tmp-color-text-reversed)
    );
    --dimension-radius-badge: var(--dimension-radius-full);
    --dimension-padding-inline-badge: var(--tmp-dimension-spacing-inline-xxs);
    --typography-badge: var(--tmp-typography-paragraph-xs-strong);

    background-color: var(--color-background-badge);
    color: var(--color-text-badge);
    border-radius: var(--dimension-radius-badge);
    padding-inline: var(--dimension-padding-inline-badge);
    font: var(--typography-badge);
  }
</style>
