<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { getTHContext } from "../../context.js";
  import { SortIndicator } from "../common/index.js";
  import type { SortLinkProps } from "./types.js";

  const componentCssClassName = "ds table-th-sort";

  let { class: className, ...rest }: SortLinkProps = $props();

  const thContext = getTHContext();
</script>

<a
  class={[componentCssClassName, className]}
  class:sorted={thContext.sortDirection}
  {...rest}
>
  <SortIndicator />
</a>

<style>
  .ds.table-th-sort {
    padding: var(--tmp-dimension-spacing-block-xxxs)
      var(--tmp-dimension-spacing-inline-xxxs);
    background: none;
    border: none;
    cursor: pointer;
    min-width: fit-content;

    font-size: var(--tmp-typography-font-size-m);
    color: var(--tmp-color-icon-status-queued);

    &:hover,
    &:focus-visible,
    &.sorted {
      color: var(--tmp-color-text-default);
    }
  }
</style>
