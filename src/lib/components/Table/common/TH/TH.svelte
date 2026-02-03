<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setTHContext } from "./context.js";
  import type { THProps } from "./types.js";

  const componentCssClassName = "ds table-th";

  let {
    class: className,
    children,
    sortDirection,
    action,
    ...rest
  }: THProps = $props();

  setTHContext({
    get sortDirection() {
      return sortDirection;
    },
  });
</script>

<th
  class={[componentCssClassName, className]}
  aria-sort={sortDirection}
  {...rest}
>
  <div>
    <span>
      {@render children?.()}
    </span>
    {@render action?.()}
  </div>
</th>

<style>
  .ds.table-th {
    div {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--lp-dimension-spacing-inline-xxs);
    }

    &:not([aria-sort]),
    &[aria-sort="none"] {
      :global(.ds.table-th-sort) {
        opacity: 0;
      }

      &:hover {
        :global(.ds.table-th-sort) {
          opacity: 1;
        }
      }

      :global(.ds.table-th-sort:focus-visible) {
        opacity: 1;
      }
    }
  }
</style>
