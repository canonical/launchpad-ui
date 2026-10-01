<script lang="ts">
  import { Breadcrumbs } from "@canonical/svelte-ds-app-launchpad";
  import type { PageLayoutProps } from "./types.js";

  let { breadcrumbsSegments, children }: PageLayoutProps = $props();
</script>

<main>
  <Breadcrumbs segments={breadcrumbsSegments} />
  <div class="page-content">
    {@render children()}
  </div>
</main>

<style>
  main {
    min-inline-size: 0;
    padding-block: var(--space-100) var(--space-200);
  }

  .page-content {
    padding-inline: var(--space-300);
  }
</style>
