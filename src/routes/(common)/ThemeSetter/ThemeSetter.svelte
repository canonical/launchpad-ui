<!-- @canonical/generator-ds 0.9.0-experimental.22 -->
<script lang="ts">
  import type { ThemeSetterProps } from "./types";

  let { theme }: ThemeSetterProps = $props();
</script>

<svelte:head>
  <meta
    name="color-scheme"
    content={theme === "system" ? "light dark" : theme}
  />
  <link rel="stylesheet" href={`/styles/colors/${theme}.css`} />
</svelte:head>
