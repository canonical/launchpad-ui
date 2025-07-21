<script lang="ts">
  import { enhance } from "$app/forms";
  import { Tabs } from "$lib/components/Tabs";
  import "$lib/modifiers";
  import { themes } from "$lib/theme";
  import type { Snippet } from "svelte";
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { ThemeSetter } from "./(common)/ThemeSetter";

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

<Tabs>
  <Tabs.Tab href="/">Home</Tabs.Tab>
  <Tabs.Tab href="/activities">Activities</Tabs.Tab>
  <Tabs.Tab href="/changes">Changes</Tabs.Tab>
</Tabs>

{@render children()}
