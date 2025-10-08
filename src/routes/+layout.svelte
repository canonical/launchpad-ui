<script lang="ts">
  import type { Snippet } from "svelte";
  import LaunchpadLogo from "$lib/components/LaunchpadLogo.svelte";
  import LaunchpadLogoText from "$lib/components/LaunchpadLogoText.svelte";
  import {
    ContextualMenuContent,
    Icon,
    Popover,
    SideNavigation,
  } from "$lib/components/index.js";
  import type { IconName } from "$lib/components/index.js";
  import { themes } from "$lib/theme";
  import "../app.css";
  import type { Theme } from "$lib/theme.js";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import type { LayoutData } from "./$types";
  import { ThemeSetter } from "./(common)/ThemeSetter";
  import { enhance } from "$app/forms";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  const theme = $derived(data.theme);

  let expanded = $derived(data.sideNavigation);

  const themesDisplay: Record<Theme, { icon: IconName; label: string }> = {
    light: { icon: "sun", label: "Light" },
    dark: { icon: "moon", label: "Dark" },
    system: { icon: "desktop", label: "Follow system" },
  };
</script>

<ThemeSetter {theme} />

<div class="app-layout">
  <SideNavigation {expanded}>
    {#snippet logo()}
      <a href="/" aria-label="Launchpad Home" class="logo-link">
        {#if expanded}
          <div
            aria-hidden="true"
            transition:cssControlledFade={{
              durationVar: "--transition-duration-side-navigation",
              easingVar: "--transition-easing-side-navigation",
            }}
          >
            <LaunchpadLogoText />
          </div>
        {/if}
        <div aria-hidden="true">
          <LaunchpadLogo />
        </div>
      </a>
    {/snippet}
    {#snippet expandToggle(toggleProps)}
      <form
        method="POST"
        action="/?/toggleSideNavigation"
        style="display: contents;"
        use:enhance={({ cancel }) => {
          // If we have JS, abort the submission and don't bother the server
          cancel();
          expanded = !expanded;
          // TODO: Use cookie parsing library. Kit uses: https://github.com/jshttp/cookie
          document.cookie = `side-navigation-expanded=${expanded}; path=/; expires=${new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 365,
          ).toUTCString()}`;
        }}
      >
        <SideNavigation.ExpandToggle
          {...toggleProps}
          name="expanded"
          value={String(!expanded)}
        />
      </form>
    {/snippet}
    <SideNavigation.LinkItem href="/">
      Home
      {#snippet icon()}
        <Icon name="home" />
      {/snippet}
    </SideNavigation.LinkItem>
    <!-- TODO: Placeholder links -->
    <SideNavigation.LinkItem disabled>
      View another MP
      {#snippet icon()}
        <Icon name="search" />
      {/snippet}
    </SideNavigation.LinkItem>
    <SideNavigation.LinkItem disabled>
      Give feedback
      {#snippet icon()}
        <Icon name="comments" />
      {/snippet}
    </SideNavigation.LinkItem>
    {#snippet footer()}
      <Popover position="inline-end span-block-start">
        {#snippet trigger(triggerProps)}
          <SideNavigation.ButtonItem {...triggerProps}>
            {#snippet icon()}
              <Icon name="color-palette" />
            {/snippet}
            Theme: {theme[0].toUpperCase() + theme.slice(1)}
          </SideNavigation.ButtonItem>
        {/snippet}
        <ContextualMenuContent
          style="margin-inline-start: var(--tmp-dimension-spacing-inline-xxs);"
        >
          <form
            method="POST"
            action="/?/changeTheme"
            use:enhance
            style="display: contents;"
          >
            <ContextualMenuContent.Group style="min-width: 280px">
              {#each themes as themeOption (themeOption)}
                {@const { icon: iconName, label } = themesDisplay[themeOption]}
                <ContextualMenuContent.ButtonItem
                  text={label}
                  name="theme"
                  value={themeOption}
                  type="submit"
                >
                  {#snippet icon()}
                    <Icon name={iconName} />
                  {/snippet}
                </ContextualMenuContent.ButtonItem>
              {/each}
            </ContextualMenuContent.Group>
          </form>
        </ContextualMenuContent>
      </Popover>
      <!-- TODO: Placeholder links -->
      <SideNavigation.LinkItem disabled>
        $username
        {#snippet icon()}
          <Icon name="user" />
        {/snippet}
      </SideNavigation.LinkItem>
      <SideNavigation.LinkItem disabled>
        Log out
        {#snippet icon()}
          <Icon name="log-out" />
        {/snippet}
      </SideNavigation.LinkItem>
    {/snippet}
  </SideNavigation>

  <main>
    {@render children()}
  </main>
</div>

<style>
  .app-layout {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .logo-link {
    display: grid;
    grid-template-areas: "one";

    > * {
      grid-area: one;
    }
  }
</style>
