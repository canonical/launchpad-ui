<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { NoResultsProps } from "./types.js";

  const componentCssClassName = "ds combobox-no-results";

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
  .ds.combobox-no-results {
    --dimension-padding-inline-combobox-no-results: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-combobox-no-results: var(
      --tmp-dimension-spacing-block-xs
    );
    --typography-font-combobox-no-results: var(
      --tmp-typography-paragraph-default
    );
    --color-text-combobox-no-results: var(--tmp-color-text-muted);
    --font-style-combobox-no-results: italic;

    padding-inline: var(--dimension-padding-inline-combobox-no-results);
    padding-block: var(--dimension-padding-block-combobox-no-results);
    font: var(--typography-font-combobox-no-results);
    color: var(--color-text-combobox-no-results);
    font-style: var(--font-style-combobox-no-results);
  }
</style>
