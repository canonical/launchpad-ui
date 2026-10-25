<script lang="ts">
  import { Button, Link } from "@canonical/svelte-ds-app-launchpad";
  import { DownloadIcon } from "@canonical/svelte-icons";
  import type { BinaryPackageDetails } from "$lib/server/launchpad/types.js";
  import { bytesToHumanReadable } from "$lib/utils/bytesToHumanReadable.js";

  const {
    artifacts,
    downloadAllHref,
  }: {
    artifacts: BinaryPackageDetails["files"];
    downloadAllHref: string;
  } = $props();

  const totalSize = $derived(
    artifacts.reduce((total, artifact) => total + artifact.size, 0),
  );
</script>

<section>
  <header>
    <h3>Artifacts</h3>
    {#if artifacts.length > 1}
      <Button
        href={downloadAllHref}
        download=""
        importance="tertiary"
        density="dense"
      >
        {#snippet iconLeft()}
          <DownloadIcon />
        {/snippet}
        Download all ({bytesToHumanReadable(totalSize)})
      </Button>
    {/if}
  </header>
  <ul>
    {#each artifacts as artifact (artifact.url)}
      <li>
        <Link
          href={artifact.url}
          download={artifact.filename}
          soft
          rel="external"
        >
          {artifact.filename}
        </Link>
        <span class="size">
          {bytesToHumanReadable(artifact.size)}
        </span>
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    margin-block-start: var(--lp-dimension-spacing-block-l);
    border-block-start: var(--lp-dimension-stroke-thickness-default) solid
      var(--lp-color-border-default);
    padding-block-start: var(--lp-dimension-spacing-block-m);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--lp-dimension-spacing-inline-l);
    margin-block-end: var(--lp-dimension-spacing-block-s);
  }

  h3 {
    font: var(--lp-typography-h4);
  }

  ul {
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--lp-dimension-spacing-block-xs);

    &:not(:last-child) {
      margin-block-end: var(--lp-dimension-spacing-block-xs);
    }

    .size {
      color: var(--lp-color-text-muted);
      flex-shrink: 0;
    }
  }
</style>
