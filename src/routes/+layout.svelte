<script lang="ts">
  import { type Snippet } from "svelte";
  import "../app.css";
  import { themes } from "$lib/theme";
  import { type LayoutData } from "./$types";
  import { enhance } from "$app/forms";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  const theme = $derived(data.theme);
</script>

<svelte:head>
  <meta
    name="color-scheme"
    content={theme === "system" ? "light dark" : theme}
  />
  <link rel="stylesheet" href={`/styles/colors/${theme}.css`} />
</svelte:head>

<form method="POST" action="/?/changeTheme" use:enhance>
  <select name="theme" value={theme}>
    {#each themes as theme (theme)}
      <option value={theme}>{theme}</option>
    {/each}
  </select>
  <button>Change</button>
</form>

{@render children()}
