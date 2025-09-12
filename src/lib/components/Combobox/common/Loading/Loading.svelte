<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Spinner } from "$lib/components/Spinner/index.js";
  import type { LoadingProps } from "./types.js";

  const componentCssClassName = "ds combobox-loading";

  let { class: className, children, ...rest }: LoadingProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  <Spinner />
  {#if children}
    {@render children()}
  {:else}
    Loading…
  {/if}
</div>

<!-- @component
`Loading` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Loading class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Loading>
```
-->

<style>
  .ds.combobox-loading {
    --dimension-padding-inline-combobox-loading: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-combobox-loading: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-gap-combobox-loading: var(--tmp-dimension-spacing-inline-xs);
    --typography-font-combobox-loading: var(--tmp-typography-paragraph-default);
    --color-text-combobox-loading: var(--tmp-color-text-default);

    display: flex;
    align-items: center;

    gap: var(--dimension-gap-combobox-loading);
    padding-inline: var(--dimension-padding-inline-combobox-loading);
    padding-block: var(--dimension-padding-block-combobox-loading);
    font: var(--typography-font-combobox-loading);
    color: var(--color-text-combobox-loading);
  }
</style>
