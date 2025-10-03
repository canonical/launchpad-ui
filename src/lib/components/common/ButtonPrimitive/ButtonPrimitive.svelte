<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts" generics="T extends 'button' | 'a'">
  import type {
    ButtonPrimitiveAnchorAttributes,
    ButtonPrimitiveButtonAttributes,
    ButtonPrimitiveProps,
  } from "./types.js";

  // Keeping the props in an object let us use the discriminated union in the template without causing `expression produces a union type that is too complex to represent` TS errors.
  let { ref = $bindable(), as, ...rest }: ButtonPrimitiveProps<T> = $props();
</script>

{#if as === "a"}
  {@const { href, disabled, children, ...restAnchor } =
    rest as unknown as ButtonPrimitiveAnchorAttributes}
  <!--
  Disabled anchor state implementation is inspired by: https://github.com/huntabyte/bits-ui/blob/main/packages/bits-ui/src/lib/bits/button/components/button.svelte
-->
  <a
    bind:this={ref}
    role={disabled && href ? "link" : undefined}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
    {...restAnchor}>{@render children?.()}</a
  >
{:else if as === "button"}
  {@const { children, ...restButton } =
    rest as unknown as ButtonPrimitiveButtonAttributes}
  <button bind:this={ref} {...restButton}>
    {@render children?.()}
  </button>
{/if}

<style>
  /* Do not use classes to keep the specificity as low as possible - (0, 1, 1) with scoping, so that the direct wrappers (e.g. Button) with unscoped styles and `.ds.class` (0, 2, 0) selectors can override these styles */
  button,
  a {
    --border-style-button: solid;
    --color-background-button-active: var(
      --tmp-color-background-neutral-active
    );
    --color-background-button-hover: var(--tmp-color-background-neutral-hover);
    --color-background-button: var(--tmp-color-background-default);
    --color-border-button-active: var(--color-border-button);
    --color-border-button-hover: var(--color-border-button);
    --color-border-button: var(--tmp-color-border-high-contrast);
    --color-text-button: var(--tmp-color-text-default);
    --dimension-border-width-button: var(--dimension-stroke-thickness-default);
    --dimension-padding-block-button: var(--tmp-dimension-spacing-block-xxs);
    --dimension-padding-inline-button: var(--tmp-dimension-spacing-inline-s);
    --opacity-button-disabled: var(--tmp-opacity-muted);
    --text-decoration-button: none;
    --typography-button: var(--tmp-typography-paragraph-default);

    cursor: pointer;
    display: inline-block;

    background-color: var(--color-background-button);
    border: var(--dimension-border-width-button) var(--border-style-button)
      var(--color-border-button);
    font: var(--typography-button);
    color: var(--color-text-button);
    text-decoration: var(--text-decoration-button);
    padding-inline: var(--dimension-padding-inline-button);
    padding-block: var(--dimension-padding-block-button);

    transition-duration: var(--tmp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--tmp-transition-timing-ease-in);

    &:not(:disabled):not([aria-disabled="true"]) {
      &:hover {
        background-color: var(--color-background-button-hover);
        border-color: var(--color-border-button-hover);
      }

      &:active {
        background-color: var(--color-background-button-active);
        border-color: var(--color-border-button-active);
      }
    }

    &:disabled,
    &[aria-disabled="true"] {
      cursor: not-allowed;
      opacity: var(--opacity-button-disabled);
    }
  }
</style>
