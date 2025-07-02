<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { ButtonProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds button";

  let {
    class: className,
    appearance = "default",
    size = "default",
    children,
    iconLeft,
    iconRight,
    loading,
    disabled,
    ...rest
  }: ButtonProps = $props();

  const interactionDisabled = $derived(disabled || loading);
</script>

<button
  class={[
    componentCssClassName,
    className,
    `appearance-${appearance}`,
    `size-${size}`,
    { loading },
    {
      "visually-disabled": disabled,
    },
  ]}
  disabled={interactionDisabled}
  {...rest}
>
  <div class="content">
    {@render iconLeft?.()}
    {#if children}
      <span class="text">
        {@render children()}
      </span>
    {/if}
    {@render iconRight?.()}
  </div>
  {#if loading}
    <!-- TODO: Replace with <Spinner /> -->
    <div class="spinner"></div>
  {/if}
</button>

<!-- @component
`Button` A reusable UI component that renders a button element.

TODO: Implement icon support and replace the spinner with a dedicated Spinner component.

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
