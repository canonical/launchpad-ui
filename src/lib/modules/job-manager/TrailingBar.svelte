<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { Spinner } from "$lib/components/index.js";

  let { trailingMinutes }: { trailingMinutes: number } = $props();
</script>

<div>
  <Spinner /> Tailing for {trailingMinutes} minutes...
</div>

<style>
  div {
    display: flex;
    align-items: center;
    position: sticky;
    bottom: 0;
    gap: var(--lp-dimension-spacing-inline-xxs);
    padding: var(--lp-dimension-spacing-block-xs)
      var(--lp-dimension-spacing-inline-m);
    background-color: var(--lp-color-background-default);
  }
</style>
