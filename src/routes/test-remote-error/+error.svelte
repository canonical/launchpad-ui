<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
</script>

<!-- 
https://github.com/sveltejs/kit/issues/14808
https://github.com/sveltejs/kit/issues/14398
-->

<h1>{page.status}: {page.error?.message}</h1>
<p>An error inside a remote function triggered +error.svelte</p>
<p>
  {#if browser}
    (This page is rendered on the client)
  {:else}
    (This page is rendered on the server)
  {/if}
</p>
