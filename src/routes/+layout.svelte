<script lang="ts">
  import type { Snippet } from "svelte";
  import { Icon, Navigation } from "$lib/components/index.js";
  import { themes } from "$lib/theme";
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { ThemeSetter } from "./(common)/ThemeSetter";
  import { enhance } from "$app/forms";
  import LaunchpadLogo from "$lib/components/LaunchpadLogo.svelte";
  import LaunchpadLogoText from "$lib/components/LaunchpadLogoText.svelte";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  const theme = $derived(data.theme);
</script>

<ThemeSetter {theme} />

{#snippet icon()}
  <Icon name="menu" />
{/snippet}

<Navigation desktopThreshold={621}>
  {#snippet logoExpanded()}
    <a href="/" aria-label="Launchpad Home">
      <!-- TODO: Replace with a universal product logo solution -->
      <LaunchpadLogoText />
    </a>
  {/snippet}
  {#snippet logo()}
    <a href="/" aria-label="Launchpad Home">
      <!-- TODO: Replace with a universal product logo solution -->
      <LaunchpadLogo />
    </a>
  {/snippet}
  {#snippet navigation()}
    {#each { length: 20 }, i (i)}
      {@const iconned = i % 2 === 0 ? icon : undefined}
      <Navigation.LinkItem
        href="/"
        selected={i === 0}
        icon={iconned}
        label="Home"
      />
      <Navigation.LinkItem
        href="/about"
        icon={iconned}
        label="About some kind of thing with a very long name"
      />
      <Navigation.ButtonItem
        onclick={() => alert("Clicked!")}
        icon={iconned}
        label="Click Me"
      />
    {/each}
  {/snippet}
  {#snippet footer()}
    <Navigation.ButtonItem label="Theme">
      {#snippet icon()}
        <Icon name="color-palette" />
      {/snippet}
    </Navigation.ButtonItem>
    <Navigation.LinkItem href="/profile" label="$username">
      {#snippet icon()}
        <Icon name="user" />
      {/snippet}
    </Navigation.LinkItem>
    <Navigation.ButtonItem label="Logout">
      {#snippet icon()}
        <Icon name="log-out" />
      {/snippet}
    </Navigation.ButtonItem>
  {/snippet}
  <div>
    <form method="POST" action="/?/changeTheme" use:enhance>
      <select name="theme" value={theme}>
        {#each themes as theme (theme)}
          <option value={theme}>{theme}</option>
        {/each}
      </select>
      <button>Change</button>
    </form>
    {@render children()}
  </div>
</Navigation>
