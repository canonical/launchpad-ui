<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { createPackagesQueryForm } from "./superhref.js";
  import type { PackagesQueryParam } from "./superhref.js";
  import { page } from "$app/state";

  const {
    replaceParams,
    children,
    ...rest
  }: {
    replaceParams: readonly PackagesQueryParam[];
    children: Snippet;
  } & Omit<HTMLFormAttributes, "method" | "onformdata"> = $props();

  const form = $derived(createPackagesQueryForm(page.url, replaceParams));
</script>

<form {...rest} method="GET" onformdata={form.onformdata}>
  {#each form.preserveParams as [name, value], index (index)}
    <input type="hidden" {name} {value} />
  {/each}
  {@render children()}
</form>

<!-- @component
`PackagesQueryForm` submits packages query parameters with a native GET form.

`replaceParams` lists query parameters to replace with submitted values. Listed
parameters without a submitted control are cleared. All other parameters are
preserved, including repeated values. Hidden inputs support submissions without
JavaScript; codec normalization is a JavaScript enhancement, and the server
still parses the submitted URL.

The component manages `method` and `onformdata` internally.
-->
