<script lang="ts">
  import { Whoops } from "$lib/launchpad-components/index.js";

  const {
    // From [Kit's docs](https://svelte.dev/docs/kit/errors#Rendering-errors): "...the error is passed directly to the +error.svelte component as a prop"
    // eslint-disable-next-line svelte/valid-prop-names-in-kit-pages
    error,
  }: {
    /*
    App.Error - errors that we throw via `error()`
    unknown - anything else (e.g., network errors, bugs in the code, etc.)
    TODO: Transform unknown errors in `handleError` hook (https://svelte.dev/docs/kit/hooks#Shared-hooks-handleError)
    */
    error: App.Error | unknown;
  } = $props();
</script>

<main>
  <Whoops {error} />
</main>
