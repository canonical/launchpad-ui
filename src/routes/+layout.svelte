<script lang="ts">
  import {
    Comments,
    Desktop,
    Home,
    IconsOptimizationProvider,
    LogOut,
    Search,
    User,
  } from "@canonical/svelte-icons";
  import type { Component, Snippet } from "svelte";
  import LaunchpadLogo from "$lib/components/LaunchpadLogo.svelte";
  import LaunchpadLogoText from "$lib/components/LaunchpadLogoText.svelte";
  import { ColorPalette, Moon, Sun } from "$lib/components/icons/index.js";
  import {
    ContextualMenuContent,
    Popover,
    ShortcutsHelpSidePanel,
    SideNavigation,
  } from "$lib/components/index.js";
  import type { ShortcutsHelpSidePanelMethods } from "$lib/components/index.js";
  import {
    GlobalShortcutsProvider,
    Shortcut,
    UseShortcuts,
  } from "$lib/shortcuts";
  import { themes } from "$lib/theme";
  import type { Theme } from "$lib/theme.js";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { ThemeSetter } from "./(common)/ThemeSetter";
  import { enhance } from "$app/forms";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  let theme = $derived(data.theme);

  let expanded = $derived(data.sideNavigation);

  const themesDisplay: Record<Theme, { Icon: Component; label: string }> = {
    light: { Icon: Sun, label: "Light" },
    dark: { Icon: Moon, label: "Dark" },
    system: { Icon: Desktop, label: "Follow system" },
  };

  let modalMethods = $state<ShortcutsHelpSidePanelMethods>();
  const helpShortcut = new Shortcut(
    "ctrl+/",
    {
      label: "Open command guide",
    },
    () => {
      modalMethods?.showModal();
    },
  );

  const toggleThemeShortcut = new Shortcut(
    "alt+shift+d",
    {
      label: "Cycle theme option",
    },
    () => (theme = themes[(themes.indexOf(theme) + 1) % themes.length]),
  );
</script>

<ThemeSetter {theme} />

<IconsOptimizationProvider>
  <GlobalShortcutsProvider>
    <UseShortcuts shortcuts={[helpShortcut, toggleThemeShortcut]} />
    <ShortcutsHelpSidePanel bind:this={modalMethods} />

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
            <Home />
          {/snippet}
        </SideNavigation.LinkItem>
        <!-- TODO: Placeholder links -->
        <SideNavigation.LinkItem disabled>
          View another MP
          {#snippet icon()}
            <Search />
          {/snippet}
        </SideNavigation.LinkItem>
        <SideNavigation.LinkItem disabled>
          Give feedback
          {#snippet icon()}
            <Comments />
          {/snippet}
        </SideNavigation.LinkItem>
        {#snippet footer()}
          <Popover position="inline-end span-block-start">
            {#snippet trigger(triggerProps)}
              <SideNavigation.ButtonItem {...triggerProps}>
                {#snippet icon()}
                  <ColorPalette />
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
                    {@const { Icon, label } = themesDisplay[themeOption]}
                    <ContextualMenuContent.ButtonItem
                      text={label}
                      name="theme"
                      value={themeOption}
                      type="submit"
                    >
                      {#snippet icon()}
                        <Icon />
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
              <User />
            {/snippet}
          </SideNavigation.LinkItem>
          <SideNavigation.LinkItem disabled>
            Log out
            {#snippet icon()}
              <LogOut />
            {/snippet}
          </SideNavigation.LinkItem>
        {/snippet}
      </SideNavigation>

      <main style:padding="1rem">
        {@render children()}
      </main>
    </div>
  </GlobalShortcutsProvider>
</IconsOptimizationProvider>

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
