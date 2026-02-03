<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { getTHContext } from "../../context.js";
  import { SortIndicator } from "../common/index.js";
  import type { SortButtonProps } from "./types.js";

  const componentCssClassName = "ds table-th-sort";

  let { class: className, ...rest }: SortButtonProps = $props();

  const thContext = getTHContext();
</script>

<button
  class={[componentCssClassName, className]}
  class:sorted={thContext.sortDirection}
  {...rest}
>
  <SortIndicator />
</button>

<style>
  .ds.table-th-sort {
    padding: var(--lp-dimension-spacing-block-xxxs)
      var(--lp-dimension-spacing-inline-xxxs);
    background: none;
    border: none;
    cursor: pointer;
    min-width: fit-content;

    font-size: var(--lp-typography-font-size-m);
    color: var(--lp-color-icon-status-queued);

    &:hover,
    &:focus-visible,
    &.sorted {
      color: var(--lp-color-text-default);
    }
  }
</style>
