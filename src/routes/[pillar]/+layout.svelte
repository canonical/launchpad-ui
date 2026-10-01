<script lang="ts">
  import { Breadcrumbs } from "@canonical/svelte-ds-app-launchpad";
  import type { LayoutProps } from "./$types.js";
  import { getBreadcrumbs, isPillarPageRouteId } from "./breadcrumbs.js";
  import { page } from "$app/state";

  let { children, params }: LayoutProps = $props();

  const segments = $derived(
    isPillarPageRouteId(page.route.id)
      ? getBreadcrumbs(page.route.id, params)
      : [],
  );
</script>

<main>
  {#if segments.length > 0}
    <Breadcrumbs {segments} />
  {/if}
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
