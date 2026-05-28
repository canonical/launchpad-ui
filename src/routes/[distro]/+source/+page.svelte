<script lang="ts">
  import type { PageProps } from "./$types.js";
  let { params }: PageProps = $props();
</script>

<svelte:head>
  <title>{params.distro} packages — Launchpad</title>
</svelte:head>

<h1>{params.distro} packages</h1>
