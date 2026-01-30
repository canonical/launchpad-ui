<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setTHContext } from "./context.js";
  import type { THProps } from "./types.js";

  const componentCssClassName = "ds table-th";

  let {
    class: className,
    children,
    "aria-sort": ariaSort,
    sortSwitcher,
    ...rest
  }: THProps = $props();

  setTHContext({
    get ariaSort() {
      return ariaSort;
    },
  });
</script>

<th aria-sort={ariaSort} class={[componentCssClassName, className]} {...rest}>
  <div>
    <span>
      {@render children?.()}
    </span>
    {@render sortSwitcher?.()}
  </div>
</th>

<style>
  .ds.table-th {
    div {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--tmp-dimension-spacing-inline-xxs);
    }

    &:not([aria-sort]) {
      :global(.ds.table-th-sort) {
        opacity: 0;
      }

      &:hover,
      &:focus-within {
        :global(.ds.table-th-sort) {
          opacity: 1;
        }
      }
    }
  }
</style>
