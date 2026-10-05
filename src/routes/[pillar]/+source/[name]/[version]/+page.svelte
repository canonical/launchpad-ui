<script lang="ts">
  import {
    PageLayout,
    distroSegment,
    packagesSegment,
    sourcePackageSegment,
  } from "$lib/launchpad-components/index.js";
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.name} {params.version} — Launchpad</title>
</svelte:head>

<PageLayout
  breadcrumbsSegments={[
    distroSegment(params.pillar),
    packagesSegment(params.pillar),
    sourcePackageSegment(params.pillar, params.name),
    { label: "Version" },
  ]}
>
  <h1>{params.name} {params.version}</h1>
</PageLayout>
