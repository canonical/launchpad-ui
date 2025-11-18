<script lang="ts">
  import type { Snippet } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { setIconContext } from "./context.js";

  const { children }: { children: Snippet } = $props();

  const registry = new SvelteSet<string>();
  setIconContext({ registry });
</script>

{@render children()}
