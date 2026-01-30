<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { TableProps } from "./types.js";

  const componentCssClassName = "ds table";

  let { class: className, children, ...rest }: TableProps = $props();
</script>

<table class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</table>

<!-- @component
`Table` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Table class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Table>
```
-->

<style>
  table {
    width: 100%;
    border-collapse: collapse;

    --border-table-row: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-low-contrast);
    --border-table-header-cell: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);
    --dimension-padding-block-table-cell: var(--tmp-dimension-spacing-block-xs);
    --dimension-padding-inline-table-cell: var(
      --tmp-dimension-spacing-inline-xs
    );

    :global {
      thead,
      tr:not(:last-child) {
        border-bottom: var(--border-table-row);
      }

      tfoot {
        border-top: var(--border-table-row);
      }

      thead th {
        position: relative;

        &:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: var(--dimension-padding-block-table-cell);
          border-left: var(--border-table-header-cell);
          height: calc(100% - var(--dimension-padding-block-table-cell) * 2);
        }
      }

      th,
      td {
        text-align: left;
        padding-inline: var(--dimension-padding-inline-table-cell);
        padding-block: var(--dimension-padding-block-table-cell);
      }

      th {
        font: var(--tmp-typography-paragraph-s-strong);
      }

      td {
        font: var(--tmp-typography-paragraph-s);
      }
    }
  }
</style>
