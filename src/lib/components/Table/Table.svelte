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
`Table` is a styled table element.

## Example Usage
```svelte
<Table>
  <caption>Sample Data</caption>
  <thead>
    <tr>
      <Table.TH sortDirection="ascending" scope="col">
        Sortable Column
        {#snippet action()}
          <Table.TH.SortButton onclick={handleSortClick} />
        {/snippet}
      </Table.TH>
      <th scope="col">Non-Sortable Column</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
    <tr>
      <td>Data 3</td>
      <td>Data 4</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Footer 1</td>
      <td>Footer 2</td>
    </tr>
  </tfoot>
</Table>
```
-->

<style>
  table {
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
