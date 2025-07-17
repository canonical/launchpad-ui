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
  {#if theme === "light"}
    <style>
      @import "@canonical/launchpad-design-tokens/dist/css/color/light.css";
    </style>
  {:else if theme === "dark"}
    <style>
      @import "@canonical/launchpad-design-tokens/dist/css/color/dark.css";
    </style>
  {:else}
    <style>
      @import "@canonical/launchpad-design-tokens/dist/css/color/system.css";
    </style>
  {/if}
</svelte:head>
