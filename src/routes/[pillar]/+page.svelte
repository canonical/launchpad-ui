<script lang="ts">
  import { PageLayout } from "#lib/launchpad-components/index.js";
  import type { PageProps } from "./$types.js";

  let { params }: PageProps = $props();

  const name = $derived(
    params.pillar.charAt(0).toUpperCase() + params.pillar.slice(1),
  );
</script>

<svelte:head>
  <title>{name} — Launchpad</title>
</svelte:head>

<PageLayout breadcrumbsSegments={[{ label: name }]}>
  <h1>{name}</h1>
</PageLayout>
