<script lang="ts">
  import "./styles.css";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    class: className,
    children,
    style,
    ...rest
  }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  class={[
    "stat-group",
    className,
  ]}
  {...rest}
>
  {@render children?.()}
</div>
