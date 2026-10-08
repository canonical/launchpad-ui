<script lang="ts">
  import type { ItemProps } from "./types.js";
  import "./styles.css";

  let {
    term,
    description,
    marked = false,
    class: className,
    ...rest
  }: ItemProps = $props();
</script>

<div class={["stat-item", className]} {...rest}>
  <dt class="stat-term">{term}</dt>
  <dd class="stat-description">
    {#if marked}<span aria-hidden="true" class="stat-dot"
      ></span>{/if}{description}
  </dd>
</div>
