<script lang="ts">
  import "../../styles.css";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLDListElement> = $props();
</script>

<dl class={["stat", className]} {...rest}>
  {@render children?.()}
</dl>
