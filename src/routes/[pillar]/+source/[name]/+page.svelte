<script lang="ts">
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.name} — Launchpad</title>
</svelte:head>

<h1>{params.name}</h1>
