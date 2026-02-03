<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { onMount } from "svelte";
  import { Spinner } from "$lib/components/Spinner/index.js";
  import { getComboboxContext } from "../../context.js";
  import type { LoadingProps } from "./types.js";

  const componentCssClassName = "ds combobox-loading";

  let { class: className, children, ...rest }: LoadingProps = $props();

  const comboboxContext = getComboboxContext();

  onMount(() => {
    const loadingHidden = comboboxContext?.loadingShown?.();
    return () => {
      loadingHidden?.();
    };
  });
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="combobox-loading"
  {...rest}
>
  <Spinner aria-hidden="true" />
  {#if children}
    {@render children()}
  {:else}
    Loading…
  {/if}
</div>

<!-- @component
`Combobox.Loading` is used to indicate that data is being loaded or processed within the Combobox.

If displayed inside a `Combobox`, it will automatically set `aria-busy="true"` on the Combobox options container, and remove it when the component is unmounted (unless `aria-busy` is explicitly provided on the `Combobox`).

## Example Usage
```svelte
<Combobox.Loading />
<Combobox.Loading>
  Fetching data…
</Combobox.Loading>
```
-->

<style>
  .ds.combobox-loading {
    --dimension-padding-inline-combobox-loading: var(
      --lp-dimension-spacing-inline-m
    );
    --dimension-padding-block-combobox-loading: var(
      --lp-dimension-spacing-block-xs
    );
    --dimension-gap-combobox-loading: var(--lp-dimension-spacing-inline-xs);
    --typography-font-combobox-loading: var(--lp-typography-paragraph-default);
    --color-text-combobox-loading: var(--lp-color-text-default);

    display: flex;
    align-items: center;

    gap: var(--dimension-gap-combobox-loading);
    padding-inline: var(--dimension-padding-inline-combobox-loading);
    padding-block: var(--dimension-padding-block-combobox-loading);
    font: var(--typography-font-combobox-loading);
    color: var(--color-text-combobox-loading);
  }
</style>
