<script lang="ts">
  import type { DescriptionProps } from "./types.js";
  import "../../styles.css";

  let { class: className, children, ...rest }: DescriptionProps = $props();
</script>

<dd class={["stat-descirption", className]} {...rest}>
  {@render children?.()}
</dd>
