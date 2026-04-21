<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setTHContext } from "./context.js";
  import type { THProps } from "./types.js";
  import "./styles.css";

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
