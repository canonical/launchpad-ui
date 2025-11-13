<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { FooterProps } from "./types.js";

  const componentCssClassName = "ds combobox-footer";

  let { class: className, children, ...rest }: FooterProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="combobox-footer"
  {...rest}
>
  {@render children?.()}
</div>

<!-- @component
`Combobox.Footer` is a container meant to be used for displaying action buttons at the bottom of the Combobox.

## Example Usage
```svelte
<Combobox.Footer>
  <Button severity="base" density="dense">
    Cancel
  </Button>
  <Button density="dense">Save</Button>
</Combobox.Footer>
```
-->

<style>
  .ds.combobox-footer {
    --dimension-padding-inline-combobox-footer: var(
      --tmp-dimension-spacing-inline-xs
    );
    --dimension-padding-block-combobox-footer: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-gap-combobox-footer: var(--tmp-dimension-spacing-inline-xs);
    --border-top-combobox-footer: var(--dimension-stroke-thickness-default)
      solid var(--tmp-color-border-default);

    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;

    gap: var(--dimension-gap-combobox-footer);
    padding-inline: var(--dimension-padding-inline-combobox-footer);
    padding-block: var(--dimension-padding-block-combobox-footer);

    &:not(:first-child) {
      border-top: var(--border-top-combobox-footer);
    }
  }
</style>
