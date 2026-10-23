<script lang="ts">
  import { Chip, Link } from "@canonical/svelte-ds-app-launchpad";
  import type { SourcePackageListEntry } from "#lib/server/launchpad/types.js";

  const MAX_ROWS = 3;
  const ROW_LENGTH_IN_CHARS = 90;
  const ITEM_GAP_IN_CHARS = 2;
  const ROUGH_CHIP_ALLOWANCE = 5;

  const {
    binaries,
    total,
    href,
  }: {
    binaries: SourcePackageListEntry["binaries"];
    total: number;
    href: (id: number) => string;
  } = $props();

  const visibleBinaries = $derived(
    binaries.slice(0, calculateVisibleBinaryCount(binaries, total)),
  );

  function calculateVisibleBinaryCount(
    binaries: SourcePackageListEntry["binaries"],
    total: number,
  ) {
    let rows = 1;
    let usedWidth = 0;
    let visibleCount = 0;
    for (const [index, { name }] of binaries.entries()) {
      const width = Math.min(name.length, ROW_LENGTH_IN_CHARS);
      usedWidth += (usedWidth ? ITEM_GAP_IN_CHARS : 0) + width;
      if (usedWidth > ROW_LENGTH_IN_CHARS) {
        rows++;
        usedWidth = width;
      }
      if (rows > MAX_ROWS) break;
      const hiddenCount = total - index - 1;
      const chipWidth = String(hiddenCount).length + ROUGH_CHIP_ALLOWANCE;
      if (
        hiddenCount <= 0 ||
        rows < MAX_ROWS ||
        usedWidth + ITEM_GAP_IN_CHARS + chipWidth <= ROW_LENGTH_IN_CHARS
      ) {
        visibleCount = index + 1;
      }
    }
    return visibleCount;
  }
</script>

{#if binaries.length}
  <ul>
    {#each visibleBinaries as binary (binary.id)}
      <li>
        <Link
          href={href(binary.id)}
          title={binary.name}
          soft
          data-sveltekit-reset={false}>{binary.name}</Link
        >
      </li>
    {/each}
    {#if total > visibleBinaries.length}
      <li>
        <Chip value={`+${total - visibleBinaries.length}`} readonly />
      </li>
    {/if}
  </ul>
{:else}
  <span>No active binaries</span>
{/if}

<style>
  ul {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    column-gap: var(--space-100);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    flex: 0 0 auto;
    min-inline-size: 0;
    max-inline-size: 100%;
  }

  li :global(a) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
