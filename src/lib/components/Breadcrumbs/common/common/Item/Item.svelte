<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import type { ItemProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds item";

  let { segment, current = false }: ItemProps = $props();

  const itemProps = $derived({
    "aria-current": current ? "page" : undefined,
    class: componentCssClassName,
  } as const);
</script>

{#if segment.href}
  <a href={segment.href} {...itemProps}>
    {segment.label}
  </a>
{:else}
  <span {...itemProps}>
    {segment.label}
  </span>
{/if}
