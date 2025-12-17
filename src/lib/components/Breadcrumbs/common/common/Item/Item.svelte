<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { Link } from "$lib/components/Link/index.js";
  import type { ItemProps } from "./types.js";

  const componentCssClassName = "ds item";

  let { segment, current = false }: ItemProps = $props();

  const itemProps = $derived({
    "aria-current": current ? "page" : undefined,
    class: componentCssClassName,
  } as const);
</script>

{#if segment.href}
  <Link href={segment.href} {...itemProps}>
    {segment.label}
  </Link>
{:else}
  <span {...itemProps}>
    {segment.label}
  </span>
{/if}
