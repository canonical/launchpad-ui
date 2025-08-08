<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Theme } from "$lib/theme";
  import { ThemeSetter } from "../../src/routes/(common)/ThemeSetter";

  let { theme, children }: { theme: Theme; children?: Snippet } = $props();
</script>

<ThemeSetter {theme} />

{@render children?.()}
