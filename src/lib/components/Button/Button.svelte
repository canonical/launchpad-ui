<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Spinner } from "$lib/components/Spinner/index.js";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { modifiersValues } from "$lib/modifiers";
  import { Content } from "./common";
  import type { ButtonProps } from "./types.js";
  import "./styles.css";

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

<ButtonPrimitive
  as="button"
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
</ButtonPrimitive>

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
