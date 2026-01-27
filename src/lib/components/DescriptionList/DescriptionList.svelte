<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setDescriptionListContext } from "./context.js";
  import type { DescriptionListProps } from "./types.js";

  const componentCssClassName = "ds description-list";

  let {
    class: className,
    children,
    orientation = "auto",
    ...rest
  }: DescriptionListProps = $props();

  setDescriptionListContext({
    get orientation() {
      return orientation;
    },
  });
</script>

<!-- Container queries cannot target the same element they are defined on -->
<div class="container">
  <dl class={[componentCssClassName, className, orientation]} {...rest}>
    {@render children?.()}
  </dl>
</div>

<!-- @component
`DescriptionList` represents a list of terms and their corresponding descriptions, typically used to display metadata or key-value pairs in a structured format.

## Example Usage
```svelte
<DescriptionList orientation="list">
  <DescriptionList.Item term="ID">134</DescriptionList.Item>
  <DescriptionList.Item term="Requested by">John Smith</DescriptionList.Item>
  <DescriptionList.Item term="Created">2023-10-01T12:00:00Z</DescriptionList.Item>
  <DescriptionList.Item term="Status">Active</DescriptionList.Item>
</DescriptionList>
```
-->

<style>
  .container {
    /* Also referenced in Item.svelte */
    container: description-list / inline-size;
  }

  .ds.description-list {
    display: grid;
    row-gap: var(--tmp-dimension-spacing-block-xs);
    column-gap: var(--tmp-dimension-spacing-inline-xs);
    --min-item-width: 160px;

    &.grid {
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(--min-item-width), 1fr)
      );
    }

    &.auto {
      /* width > 621 - (2 * 24) = 573 */
      @container description-list (width > 573px) {
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--min-item-width), 1fr)
        );
      }
    }
  }
</style>
