<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Spinner } from "$lib/components/Spinner/index.js";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { Content } from "./common";
  import type { ButtonProps } from "./types.js";

  const componentCssClassName = "ds button";

  let {
    class: className,
    ref = $bindable(),
    severity,
    density,
    children,
    iconLeft,
    iconRight,
    loading,
    disabled,
    ...rest
  }: ButtonProps = $props();

  const isDisabled = $derived(loading || disabled);
</script>

<ButtonPrimitive
  bind:ref
  class={[
    componentCssClassName,
    className,
    severity,
    density,
    { loading, "explicit-disabled": disabled },
  ]}
  disabled={isDisabled}
  {...rest}
>
  <Content {iconLeft} {iconRight}>
    {@render children?.()}
  </Content>
  {#if loading}
    <span class="loader">
      <Spinner />
    </span>
  {/if}
</ButtonPrimitive>

<!-- @component
`Button` is a styled button element.

## Example Usage
```svelte
<Button density="dense" severity="brand">
  {#snippet iconLeft()}
    <Check />
  {/snippet}
  Button Text
  {#snippet iconRight()}
    <ArrowRight />
  {/snippet}
</Button>
```
-->

<style>
  :global {
    .ds.button {
      --border-style-button: solid;
      --color-background-button-active: var(
        --lp-color-background-active-context,
        var(--lp-color-background-neutral-active)
      );
      --color-background-button-hover: var(
        --lp-color-background-hover-context,
        var(--lp-color-background-neutral-hover)
      );
      --color-background-button: var(
        --lp-color-background-context,
        var(--lp-color-background-default)
      );
      --color-border-button: var(
        --lp-color-border-context,
        var(--lp-color-border-high-contrast)
      );
      --color-border-button-hover: var(
        --lp-color-border-hover-context,
        var(--color-border-button)
      );
      --color-border-button-active: var(
        --lp-color-border-active-context,
        var(--color-border-button)
      );
      --color-text-button: var(
        --lp-color-text-context,
        var(--lp-color-text-default)
      );
      --dimension-border-width-button: var(
        --dimension-stroke-thickness-default
      );
      --dimension-gap-inline-icon: var(--lp-dimension-spacing-inline-xs);
      --dimension-padding-block-button-content: var(
        --dimension-padding-block-context,
        var(--lp-dimension-spacing-block-xxs)
      );
      --dimension-padding-inline-button-content: var(
        --dimension-padding-inline-context,
        var(--lp-dimension-spacing-inline-s)
      );
      --dimension-radius-button: var(--dimension-radius-medium);
      --typography-button: var(
        --lp-typography-context,
        var(--lp-typography-paragraph-default)
      );

      --dimension-padding-block-button: 0;
      --dimension-padding-inline-button: 0;

      align-items: center;
      display: inline-flex;
      justify-content: center;

      &:not(.explicit-disabled) {
        --opacity-button-disabled: 1;
      }

      &.loading {
        position: relative;

        > .button-content {
          visibility: hidden;
        }

        > .loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      /* Modifiers */
      &.brand {
        --lp-color-text-context: var(--lp-color-text-white);
        --lp-color-border-context: var(--lp-color-brand-default);
        --lp-color-background-context: var(--lp-color-brand-default);
        --lp-color-background-hover-context: var(--lp-color-brand-hover);
        --lp-color-background-active-context: var(--lp-color-brand-active);
      }

      &.base {
        --lp-color-border-context: transparent;
      }
    }
  }
</style>
