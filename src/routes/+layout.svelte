<script lang="ts">
  import {
    CommentsIcon,
    DesktopIcon,
    HomeIcon,
    IconsOptimizationProvider,
    IsoIcon,
    LogOutIcon,
    SearchIcon,
    UserIcon,
  } from "@canonical/svelte-icons";
  import type { Component, Snippet } from "svelte";
  import {
    ColorPaletteIcon,
    MoonIcon,
    SunIcon,
  } from "$lib/components/icons/index.js";
  import {
    ContextualMenuContent,
    Popover,
    ShortcutsHelpSidePanel,
    SideNavigation,
  } from "$lib/components/index.js";
  import type { ShortcutsHelpSidePanelMethods } from "$lib/components/index.js";
  import {
    LaunchpadLogo,
    LaunchpadLogoText,
  } from "$lib/launchpad-components/index.js";
  import {
    GlobalShortcutsProvider,
    Shortcut,
    UseShortcuts,
  } from "$lib/shortcuts";
  import "../app.css";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import { ThemeSetter } from "./(common)/ThemeSetter/index.js";
  import {
    getTheme,
    setThemeCommand,
    setThemeForm,
  } from "./(common)/theme.remote.js";
  import type { SideNavigationState } from "./(cookies)/side-navigation-state.js";
  import { sideNavigationStateCookie } from "./(cookies)/side-navigation-state.js";
  import {
    
    themeCookie,
    themes
  } from "./(cookies)/theme.js";
import type {Theme} from "./(cookies)/theme.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  let { children }: { children: Snippet } = $props();

  const themesDisplay: Record<Theme, { Icon: Component; label: string }> = {
    light: { Icon: SunIcon, label: "Light" },
    dark: { Icon: MoonIcon, label: "Dark" },
    system: { Icon: DesktopIcon, label: "Follow system" },
  };

  const clientSideSetTheme = async (theme: Theme) => {
    await cookieStore.set({
      name: themeCookie.name,
      value: theme,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    getTheme().set(theme);
  };

  let modalMethods = $state<ShortcutsHelpSidePanelMethods>();
  const helpShortcut = new Shortcut(
    "ctrl+/",
    {
      label: "Open command guide",
    },
    () => modalMethods?.showModal(),
  );

  const toggleThemeShortcut = new Shortcut(
    "alt+shift+d",
    {
      label: "Cycle theme option",
    },
    async () => {
      const newTheme =
        themes[(themes.indexOf(await getTheme()) + 1) % themes.length];

      try {
        await clientSideSetTheme(newTheme);
      } catch (e) {
        console.error(e);
        await setThemeCommand(newTheme);
      }
    },
  );

  const sideNavigationState = $state<SideNavigationState>(
    sideNavigationStateCookie.defaultValue,
  );
  const isSideNavigationExpanded = $derived(sideNavigationState === "expanded");

</script>

<ThemeSetter theme={await getTheme()} />

<IconsOptimizationProvider>
  <GlobalShortcutsProvider>
    <UseShortcuts shortcuts={[helpShortcut, toggleThemeShortcut]} />
    <ShortcutsHelpSidePanel bind:this={modalMethods} />

    <div class="app-layout">
      <SideNavigation expanded={isSideNavigationExpanded}>
        {#snippet logo()}
          <a href={resolve("/")} aria-label="Launchpad Home" class="logo-link">
            {#if isSideNavigationExpanded}
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
          <SideNavigation.ExpandToggle
            {...toggleProps}
            onclick={() =>
              setSideNavigationState(
                isSideNavigationExpanded ? "collapsed" : "expanded",
              )}
          />
        {/snippet}
        <SideNavigation.LinkItem
          href={resolve("/")}
          selected={page.url.pathname === "/"}
          aria-current={page.url.pathname === "/" ? "page" : undefined}
        >
          Home
          {#snippet icon()}
            <HomeIcon />
          {/snippet}
        </SideNavigation.LinkItem>
        <SideNavigation.LinkItem
          href={resolve("/jobs")}
          selected={page.url.pathname.startsWith("/jobs")}
          aria-current={page.url.pathname.startsWith("/jobs")
            ? "page"
            : undefined}
        >
          Jobs
          {#snippet icon()}
            <IsoIcon />
          {/snippet}
        </SideNavigation.LinkItem>
        <!-- TODO: Placeholder links -->
        <SideNavigation.LinkItem disabled>
          View another MP
          {#snippet icon()}
            <SearchIcon />
          {/snippet}
        </SideNavigation.LinkItem>
        <SideNavigation.LinkItem disabled>
          Give feedback
          {#snippet icon()}
            <CommentsIcon />
          {/snippet}
        </SideNavigation.LinkItem>
        {#snippet footer()}
          <Popover position="inline-end span-block-start">
            {#snippet trigger(triggerProps)}
              <SideNavigation.ButtonItem {...triggerProps}>
                {#snippet icon()}
                  <ColorPaletteIcon />
                {/snippet}
                Theme:
                <span style="text-transform: capitalize;"
                  >{await getTheme()}</span
                >
              </SideNavigation.ButtonItem>
            {/snippet}
            <ContextualMenuContent
              style="margin-inline-start: var(--tmp-dimension-spacing-inline-xxs);"
            >
              <form
                {...setThemeForm.enhance(
                  async ({ data: { theme }, submit }) => {
                    try {
                      // If we have JS, try not to bother the server at all
                      await clientSideSetTheme(theme);
                    } catch (e) {
                      console.error(e);
                      await submit();
                    }
                  },
                )}
                style="display: contents;"
              >
                <ContextualMenuContent.Group style="min-width: 280px">
                  {#each themes as themeOption (themeOption)}
                    {@const { Icon, label } = themesDisplay[themeOption]}
                    <ContextualMenuContent.ButtonItem
                      text={label}
                      {...setThemeForm.fields.theme.as("submit", themeOption)}
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
              <UserIcon />
            {/snippet}
          </SideNavigation.LinkItem>
          <SideNavigation.LinkItem disabled>
            Log out
            {#snippet icon()}
              <LogOutIcon />
            {/snippet}
          </SideNavigation.LinkItem>
        {/snippet}
      </SideNavigation>

      <main>
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
