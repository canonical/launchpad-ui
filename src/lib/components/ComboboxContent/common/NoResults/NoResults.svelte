<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { NoResultsProps } from "./types.js";

  const componentCssClassName = "ds combobox-content-no-results";

  let { class: className, children, ...rest }: NoResultsProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {#if children}
    {@render children()}
  {:else}
    No results.
  {/if}
</div>

<!-- @component
`NoResults` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<NoResults class="custom-class" id="unique-id">
  <p>Content goes here</p>
</NoResults>
```
-->

<style>
  .ds.combobox-content-no-results {
    --dimension-padding-inline-combobox-content-no-results: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-combobox-content-no-results: var(
      --tmp-dimension-spacing-block-xs
    );
    --typography-font-combobox-content-no-results: var(
      --tmp-typography-paragraph-default
    );
    --color-text-combobox-content-no-results: var(--tmp-color-text-muted);
    --font-style-combobox-content-no-results: italic;

    padding-inline: var(--dimension-padding-inline-combobox-content-no-results);
    padding-block: var(--dimension-padding-block-combobox-content-no-results);
    font: var(--typography-font-combobox-content-no-results);
    color: var(--color-text-combobox-content-no-results);
    font-style: var(--font-style-combobox-content-no-results);
  }
</style>
