<script lang="ts">
  import { type Snippet } from "svelte";
  import { ThemeSetter } from "../src/routes/(common)/ThemeSetter";

  let { theme, children }: { theme: string; children?: Snippet } = $props();
</script>

<ThemeSetter {theme} />

{@render children?.()}
