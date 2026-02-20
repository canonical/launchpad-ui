<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { ItemsCountProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination-items-count";

  let { class: className, showing, total, ...rest }: ItemsCountProps = $props();

  const text = $derived.by(() => {
    if (total || (showing === 0 && total === 0)) {
      return `${showing} of ${total} ${total === 1 ? "item" : "items"}`;
    }
    return `${showing} ${showing === 1 ? "item" : "items"}`;
  });
</script>

<span class={[componentCssClassName, className]} {...rest}>
  Showing {text}
</span>
