<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { DescriptionListProps } from "./types.js";

  const componentCssClassName = "ds description-list";

  let { class: className, children, ...rest }: DescriptionListProps = $props();
</script>

<dl
  class={[componentCssClassName, className]}
  data-testid="description-list"
  {...rest}
>
  {@render children?.()}
</dl>

<!-- @component
`DescriptionList` represents a list of terms and their corresponding descriptions, typically used to display metadata or key-value pairs in a structured format.

## Example Usage
```svelte
<DescriptionList>
  <DescriptionList.Item term="ID">134</DescriptionList.Item>
  <DescriptionList.Item term="Requested by">John Smith</DescriptionList.Item>
  <DescriptionList.Item term="Created">2023-10-01T12:00:00Z</DescriptionList.Item>
  <DescriptionList.Item term="Status" orientation="vertical">Active</DescriptionList.Item>
</DescriptionList>
```
-->

<style>
  .ds.description-list {
    display: flex;
    flex-direction: column;
    gap: var(--tmp-dimension-spacing-block-xxs);
  }
</style>
