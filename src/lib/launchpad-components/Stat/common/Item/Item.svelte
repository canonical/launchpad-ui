<script lang="ts">
  import type { ItemProps } from "./types.js";
  import "./styles.css";

  let { key, class: className, children, ...rest }: ItemProps = $props();
</script>

<div class={["stat-item", className]} {...rest}>
  <dt class="stat-term">{key}</dt>
  <dd class="stat-description">
    {@render children?.()}
  </dd>
</div>
