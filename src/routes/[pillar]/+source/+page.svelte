<script lang="ts">
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.pillar} packages — Launchpad</title>
</svelte:head>

<h1>{params.pillar} packages</h1>
