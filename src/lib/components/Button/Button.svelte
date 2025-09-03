<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Spinner } from "$lib/components/Spinner/index.js";
  import { modifiersValues } from "$lib/modifiers";
  import { Content } from "./common";
  import type { ButtonProps } from "./types.js";

  const componentCssClassName = "ds button";

  let {
    class: className,
    modifiers,
    children,
    iconLeft,
    iconRight,
    loading,
    disabled,
    ...rest
  }: ButtonProps = $props();

  const isDisabled = $derived(loading || disabled);
</script>

<button
  class={[
    componentCssClassName,
    className,
    modifiersValues(modifiers),
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
</button>

<!-- @component
`Button` is a styled button element.

## Example Usage
```svelte
<Button modifiers={{ density: "dense", severity: "brand" }}>
  {#snippet iconLeft()}
    <Icon name="check" />
  {/snippet}
  Button Text
  {#snippet iconRight()}
    <Icon name="arrow-right" />
  {/snippet}
</Button>
```
-->

<style>
  .ds.button {
    --border-style-button: solid;
    --color-background-button-active: var(
      --tmp-color-background-active-context,
      var(--tmp-color-background-neutral-active)
    );
    --color-background-button-hover: var(
      --tmp-color-background-hover-context,
      var(--tmp-color-background-neutral-hover)
    );
    --color-background-button: var(
      --tmp-color-background-context,
      var(--tmp-color-background-default)
    );
    --color-border-button: var(
      --tmp-color-border-context,
      var(--tmp-color-border-high-contrast)
    );
    --color-border-button-hover: var(
      --tmp-color-border-hover-context,
      var(--color-border-button)
    );
    --color-border-button-active: var(
      --tmp-color-border-active-context,
      var(--color-border-button)
    );
    --color-text-button: var(
      --tmp-color-text-context,
      var(--tmp-color-text-default)
    );
    --dimension-border-width-button: var(--dimension-stroke-thickness-default);
    --dimension-gap-inline-icon: var(--tmp-dimension-spacing-inline-xs);
    --dimension-padding-block-button: var(
      --dimension-padding-block-context,
      var(--tmp-dimension-spacing-block-xxs)
    );
    --dimension-padding-inline-button: var(
      --dimension-padding-inline-context,
      var(--tmp-dimension-spacing-inline-s)
    );
    --dimension-radius-button: var(--dimension-radius-medium);
    --opacity-button: 1;
    --typography-button: var(
      --tmp-typography-context,
      var(--tmp-typography-paragraph-default)
    );

    align-items: center;
    background-color: var(--color-background-button);
    border-radius: var(--dimension-radius-button);
    border: var(--dimension-border-width-button) var(--border-style-button)
      var(--color-border-button);
    color: var(--color-text-button);
    cursor: pointer;
    display: inline-flex;
    font: var(--typography-button);
    justify-content: center;
    opacity: var(--opacity-button);
    transition-duration: var(--tmp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--tmp-transition-timing-ease-in);

    &:disabled {
      cursor: not-allowed;
    }

    &.explicit-disabled {
      --opacity-button: var(--tmp-opacity-muted);
    }

    &:not(.explicit-disabled) {
      --opacity-button: 1;
    }

    &:not(:disabled) {
      &:hover {
        background-color: var(--color-background-button-hover);
        border-color: var(--color-border-button-hover);
      }
      &:active {
        background-color: var(--color-background-button-active);
        border-color: var(--color-border-button-active);
      }
    }

    &.loading {
      position: relative;

      > :global(.button-content) {
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
      --tmp-color-text-context: var(--tmp-color-text-white);
      --tmp-color-border-context: var(--tmp-color-brand-default);
      --tmp-color-background-context: var(--tmp-color-brand-default);
      --tmp-color-background-hover-context: var(--tmp-color-brand-hover);
      --tmp-color-background-active-context: var(--tmp-color-brand-active);
    }

    &.base {
      --tmp-color-border-context: transparent;
    }
  }
</style>
