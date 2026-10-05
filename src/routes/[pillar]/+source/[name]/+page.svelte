<script lang="ts">
  import {
    PageLayout,
    distroSegment,
    packagesSegment,
  } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.name} — Launchpad</title>
</svelte:head>

<PageLayout
  breadcrumbsSegments={[
    distroSegment(params.pillar),
    packagesSegment(params.pillar),
    { label: "Package overview" },
  ]}
>
  <h1>{params.name}</h1>
</PageLayout>
