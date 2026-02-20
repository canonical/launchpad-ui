<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { Select } from "$lib/components/Select/index.js";
  import { getPaginationContext } from "../../context.js";
  import type { ItemsPerPageSelectProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination-items-per-page-select";

  let {
    id: idProp,
    class: className,
    children,
    value = $bindable(),
    style,
    "data-testid": dataTestId,
    ...rest
  }: ItemsPerPageSelectProps = $props();

  const paginationContext = getPaginationContext();

  const idFallback = $props.id();
  const id = $derived(idProp || idFallback);
</script>

<div
  class={[componentCssClassName, className]}
  {style}
  data-testid={dataTestId}
>
  <label for={id}>Items per page:</label>
  <Select
    {id}
    bind:value
    class="select"
    aria-controls={paginationContext.tableId}
    {...rest}
  >
    {@render children?.()}
  </Select>
</div>

<!-- @component
`ItemsPerPageSelect` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ItemsPerPageSelect class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ItemsPerPageSelect>
```
-->
