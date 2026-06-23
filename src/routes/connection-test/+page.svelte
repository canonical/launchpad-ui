<script lang="ts">
  import { Button, TextInput } from "@canonical/svelte-ds-app-launchpad";
  import type { RemoteQueryFunction } from "@sveltejs/kit";
  import { getMe, getUbuntu, setLpCookie } from "./connection-test.remote.js";
  import type { ConnectionResponse } from "./connection-test.remote.js";
  import { browser } from "$app/environment";
</script>

<main class="page">
  <h1>Launchpad connection test</h1>

  <form {...setLpCookie}>
    <TextInput
      // remote form.as("password") now is typed with value: string | number which our TextInput doesn't tolerate.
      // TODO(DAL): Investigate why and fix in DAL?
      {...setLpCookie.fields._lp.as("password") as { value: string }}
      placeholder="Enter your Launchpad cookie value"
      aria-label="Launchpad cookie"
      autocomplete="off"
      data-bwignore
    />
    <Button
      {...setLpCookie.fields.action.as("submit", "save")}
      disabled={browser && !setLpCookie.fields._lp.value()?.trim()}>Save</Button
    >
    <Button {...setLpCookie.fields.action.as("submit", "clear")}>Clear</Button>
  </form>

  <section>
    <h2>Anonymous — <code>/api/devel/ubuntu</code></h2>
    {@render output(getUbuntu)}
  </section>

  <section>
    <h2>Authenticated — <code>/api/devel/people/+me</code></h2>
    {@render output(getMe)}
  </section>
</main>

{#snippet output(query: RemoteQueryFunction<void, ConnectionResponse>)}
  <svelte:boundary onerror={(e) => console.error(e)}>
    {@const response = await query()}
    <p>HTTP status: {response.status}</p>
    {#if "json" in response}
      <pre>{JSON.stringify(response.json, null, 2)}</pre>
    {:else if response.text}
      <pre>{response.text}</pre>
    {/if}

    {#snippet pending()}
      <p>Loading…</p>
    {/snippet}

    {#snippet failed(error)}
      <p class="error">
        {error}
      </p>
    {/snippet}
  </svelte:boundary>
{/snippet}

<style>
  main {
    padding-block: var(--lp-dimension-spacing-block-m);
    padding-inline: var(--lp-dimension-spacing-inline-l);

    > :not(:first-child) {
      margin-block-start: var(--lp-dimension-spacing-block-l);
    }
  }

  form {
    display: flex;
    align-items: stretch;
    gap: var(--lp-dimension-spacing-inline-s);
  }

  pre {
    overflow: auto;
    max-height: 24rem;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    padding: var(--lp-dimension-spacing-block-s)
      var(--lp-dimension-spacing-inline-s);
    background: var(--lp-color-background-alt);
  }

  .error {
    color: var(--lp-color-negative);
  }
</style>
