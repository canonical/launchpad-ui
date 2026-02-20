<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { Select } from "$lib/components/Select/index.js";
  import { getPaginationContext } from "../../context.js";
  import type { PageSelectProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination-page-select";

  let {
    id: idProp,
    class: className,
    style,
    children,
    value = $bindable(),
    totalPages,
    "data-testid": dataTestId,
    ...rest
  }: PageSelectProps = $props();

  const paginationContext = getPaginationContext();

  const idFallback = $props.id();
  const id = $derived(idProp || idFallback);
</script>

<div
  class={[componentCssClassName, className]}
  {style}
  data-testid={dataTestId}
>
  <label for={id} class="visually-hidden">Page:</label>
  <Select
    {id}
    bind:value
    class="select"
    aria-controls={paginationContext.tableId}
    {...rest}
  >
    {@render children?.()}
  </Select>
  <span>of {totalPages} Page{totalPages === 1 ? "" : "s"}</span>
</div>
