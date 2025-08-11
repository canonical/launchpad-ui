<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import Icon from "../Icon/Icon.svelte";
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
</script>

<button
  class={[componentCssClassName, className, modifiers, { loading }]}
  disabled={loading || disabled}
  {...rest}
>
  <Content {iconLeft} {iconRight}>
    {@render children?.()}
  </Content>
  {#if loading}
    <span class="loader">
      <Icon name="spinner" modifiers={["spin"]} />
    </span>
  {/if}
</button>

<!-- @component
`Button` is a styled button element.

## Example Usage
```svelte
<Button appearance="primary" size="small">
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
    --dimension-border-width-button: var(--dimension-stroke-thickness-default);
    --dimension-radius-button: var(--dimension-radius-medium);
    --border-style-button: solid;
    --color-border-button: var(
      --tmp-color-border-context,
      var(--tmp-color-border-high-contrast)
    );
    --typography-button: var(
      --tmp-typography-context,
      var(--tmp-typography-paragraph-default)
    );
    --dimension-padding-block-button: var(
      --dimension-padding-block-context,
      var(--tmp-dimension-spacing-block-xxs)
    );
    --dimension-padding-inline-button: var(
      --dimension-padding-inline-context,
      var(--tmp-dimension-spacing-inline-s)
    );
    --color-background-button: var(
      --tmp-color-background-context,
      var(--tmp-color-background-default)
    );
    --color-background-button-hover: var(
      --tmp-color-background-hover-context,
      var(--tmp-color-background-neutral-hover)
    );
    --color-background-button-active: var(
      --tmp-color-background-active-context,
      var(--tmp-color-background-neutral-active)
    );
    --color-text-button: var(
      --tmp-color-text-context,
      var(--tmp-color-text-default)
    );
    --opacity-button: 1;
    --dimension-gap-inline-icon: var(--tmp-dimension-spacing-inline-xs);
    --dimension-size-button-icon: var(--tmp-dimension-size-xs);

    /* display: inline-flex; */
    font: var(--typography-button);
    border: var(--dimension-border-width-button) var(--border-style-button)
      var(--color-border-button);
    border-radius: var(--dimension-radius-button);
    background-color: var(--color-background-button);
    color: var(--color-text-button);
    opacity: var(--opacity-button);
    transition-property: background-color, border-color;
    transition-duration: 0.1s;
    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      --opacity-button: 0.5;
      cursor: not-allowed;
      &.loading {
        --opacity-button: 1;
      }
    }

    &:not(:disabled) {
      &:hover {
        background-color: var(--color-background-button-hover);
      }
      &:active {
        background-color: var(--color-background-button-active);
      }
    }

    &.loading {
      position: relative;

      --tmp-color-background-context: var(
        --tmp-color-background-active-context
      );
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
      --tmp-color-text-context: var(--tmp-color-text-reversed);
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
