<script lang="ts">
  import type { TermProps } from "./types.js";
  import "../../styles.css";

  let { class: className, children, ...rest }: TermProps = $props();
</script>

<dt class={["stat-term", className]} {...rest}>
  {@render children?.()}
</dt>
