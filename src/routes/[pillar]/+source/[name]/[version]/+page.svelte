<script lang="ts">
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.name} {params.version} — Launchpad</title>
</svelte:head>

<h1>{params.name} {params.version}</h1>
