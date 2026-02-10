<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { getTHContext } from "../../context.js";
  import { SortIndicator } from "../common/index.js";
  import type { SortButtonProps } from "./types.js";

  const componentCssClassName = "ds table-th-sort";

  let { class: className, ...rest }: SortButtonProps = $props();

  const thContext = getTHContext();
</script>

<ButtonPrimitive
  class={[
    componentCssClassName,
    className,
    { sorted: thContext.sortDirection },
  ]}
  {...rest}
>
  <SortIndicator />
</ButtonPrimitive>

<style>
  :global(.ds.table-th-sort) {
    padding: var(--lp-dimension-spacing-block-xxxs)
      var(--lp-dimension-spacing-inline-xxxs);
    background: none;
    border: none;
    cursor: pointer;
    min-width: fit-content;

    font-size: var(--lp-typography-font-size-m);
    color: var(--lp-color-icon-status-queued);

    --color-background-button-hover: transparent;
    --color-background-button-active: transparent;

    &:hover,
    &:focus-visible,
    &.sorted {
      color: var(--lp-color-text-default);
    }
  }
</style>
