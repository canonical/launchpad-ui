<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import {
    CommentsIcon,
    DesktopIcon,
    HomeIcon,
    IconsOptimizationProvider,
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
  import type { Theme } from "$lib/theme.js";
  import { themeCookieName, themes } from "$lib/theme.js";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import { ThemeSetter } from "./(common)/ThemeSetter/index.js";
  import { sideNavigationStateCookieName } from "./(common)/side-navigation-state.js";
  import {
    getSideNavigationState,
    setSideNavigationStateForm,
  } from "./(common)/side-navigation-state.remote.js";
  import {
    getTheme,
    setThemeCommand,
    setThemeForm,
  } from "./(common)/theme.remote.js";
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
      name: themeCookieName,
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

  const sideNavigationStatePromise = $derived(getSideNavigationState());
  const isSideNavigationExpanded = $derived(
    (await sideNavigationStatePromise) === "expanded",
  );

  // The next state is lifted out of the form submission handler
  // as a workaround for: https://github.com/sveltejs/kit/issues/15969
  // TODO: Remove when the above is resolved
  const nextSideNavigationState = $derived(
    isSideNavigationExpanded ? "collapsed" : "expanded",
  );
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
          <form
            {...setSideNavigationStateForm.enhance(async ({ submit }) => {
              try {
                // If we have JS, try not to bother the server at all
                await cookieStore.set({
                  name: sideNavigationStateCookieName,
                  value: nextSideNavigationState,
                  expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
                  sameSite: "lax",
                });
                getSideNavigationState().set(nextSideNavigationState);
              } catch (e) {
                console.error(e);
                await submit();
              }
            })}
            style="display: contents;"
          >
            <SideNavigation.ExpandToggle
              {...toggleProps}
              {...setSideNavigationStateForm.fields.state.as(
                "submit",
                nextSideNavigationState,
              )}
            />
          </form>
        {/snippet}
        <SideNavigation.NavigationItem
          href={resolve("/")}
          selected={page.url.pathname === "/"}
          aria-current={page.url.pathname === "/" ? "page" : undefined}
        >
          Home
          {#snippet icon()}
            <HomeIcon />
          {/snippet}
        </SideNavigation.NavigationItem>
        <!-- TODO: Placeholder links -->
        <SideNavigation.NavigationItem disabled>
          View another MP
          {#snippet icon()}
            <SearchIcon />
          {/snippet}
        </SideNavigation.NavigationItem>
        <SideNavigation.NavigationItem disabled>
          Give feedback
          {#snippet icon()}
            <CommentsIcon />
          {/snippet}
        </SideNavigation.NavigationItem>
        {#snippet footer()}
          <Popover position="inline-end span-block-start">
            {#snippet trigger(triggerProps)}
              <SideNavigation.NavigationItem {...triggerProps}>
                {#snippet icon()}
                  <ColorPaletteIcon />
                {/snippet}
                Theme:
                <span style="text-transform: capitalize;"
                  >{await getTheme()}</span
                >
              </SideNavigation.NavigationItem>
            {/snippet}
            <ContextualMenuContent
              style="margin-inline-start: var(--lp-dimension-spacing-inline-xxs);"
            >
              <ContextualMenuContent.Group style="min-width: 280px">
                {#each themes as themeOption (themeOption)}
                  <!-- 
                    A form per theme option as a workaround for: https://github.com/sveltejs/kit/issues/15969
                    TODO: Change back to a single form when the above is resolved
                  -->
                  {@const themeForm = setThemeForm.for(themeOption)}
                  {@const { Icon, label } = themesDisplay[themeOption]}
                  <form
                    {...themeForm.enhance(async ({ submit }) => {
                      try {
                        // If we have JS, try not to bother the server at all
                        await clientSideSetTheme(themeOption);
                      } catch (e) {
                        console.error(e);
                        await submit();
                      }
                    })}
                    style="display: contents;"
                  >
                    <ContextualMenuContent.ButtonItem
                      text={label}
                      {...themeForm.fields.theme.as("submit", themeOption)}
                    >
                      {#snippet icon()}
                        <Icon />
                      {/snippet}
                    </ContextualMenuContent.ButtonItem>
                  </form>
                {/each}
              </ContextualMenuContent.Group>
            </ContextualMenuContent>
          </Popover>
          <!-- TODO: Placeholder links -->
          <SideNavigation.NavigationItem disabled>
            $username
            {#snippet icon()}
              <UserIcon />
            {/snippet}
          </SideNavigation.NavigationItem>
          <SideNavigation.NavigationItem disabled>
            Log out
            {#snippet icon()}
              <LogOutIcon />
            {/snippet}
          </SideNavigation.NavigationItem>
        {/snippet}
      </SideNavigation>

      {@render children()}
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
