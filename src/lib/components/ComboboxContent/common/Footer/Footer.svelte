<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { FooterProps } from "./types.js";

  const componentCssClassName = "ds combobox-content-footer";

  let { class: className, children, ...rest }: FooterProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</div>

<!-- @component
`Footer` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Footer class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Footer>
```
-->

<style>
  .ds.combobox-content-footer {
    --dimension-padding-inline-combobox-content-footer: var(
      --tmp-dimension-spacing-inline-xs
    );
    --dimension-padding-block-combobox-content-footer: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-gap-combobox-content-footer: var(
      --tmp-dimension-spacing-inline-xs
    );
    --border-top-combobox-content-footer: var(
        --dimension-stroke-thickness-default
      )
      solid var(--tmp-color-border-default);

    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;

    gap: var(--dimension-gap-combobox-content-footer);
    padding-inline: var(--dimension-padding-inline-combobox-content-footer);
    padding-block: var(--dimension-padding-block-combobox-content-footer);

    &:not(:first-child) {
      border-top: var(--border-top-combobox-content-footer);
    }
  }
</style>
