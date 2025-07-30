<script lang="ts">
  import type { Snippet } from "svelte";
  import { themes } from "$lib/theme";
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { ThemeSetter } from "./(common)/ThemeSetter";
  import { enhance } from "$app/forms";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  const theme = $derived(data.theme);
</script>

<ThemeSetter {theme} />

<form method="POST" action="/?/changeTheme" use:enhance>
  <select name="theme" value={theme}>
    {#each themes as theme (theme)}
      <option value={theme}>{theme}</option>
    {/each}
  </select>
  <button>Change</button>
</form>

{@render children()}
