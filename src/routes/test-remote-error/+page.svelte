<script>
  import { throwError } from "./error.remote.js";
  import { browser } from "$app/environment";
</script>

<!-- 
https://github.com/sveltejs/kit/issues/14808
https://github.com/sveltejs/kit/issues/14398
-->

<svelte:boundary onerror={(e) => console.error(e)}>
  {await throwError()}
  {#snippet failed()}
    <p>An error inside a remote function triggered svelte:boundary</p>
    <p>
      {#if browser}
        (This page is rendered on the client)
      {:else}
        (This page is rendered on the server)
      {/if}
    </p>
  {/snippet}
</svelte:boundary>
