<script module lang="ts">
  import {
    HomeIcon,
    LinkIcon,
    LogOutIcon,
    MountIcon,
    NotificationsIcon,
    PodsIcon,
    UserIcon,
  } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { ColorPaletteIcon } from "$lib/components/icons/index.js";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import LaunchpadLogo from "../LaunchpadLogo.svelte";
  import LaunchpadLogoText from "../LaunchpadLogoText.svelte";
  import { SideNavigation } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/SideNavigation",
    tags: ["autodocs"],
    component: SideNavigation,
    argTypes: {
      children: { control: { disable: true } },
      expandToggle: { control: { disable: true } },
      footer: { control: { disable: true } },
      logo: { control: { disable: true } },
    },
  });

  let expandedState = $state(true);

  const icons = [
    HomeIcon,
    UserIcon,
    LogOutIcon,
    LinkIcon,
    NotificationsIcon,
    PodsIcon,
    MountIcon,
  ];
</script>

<Story name="Default">
  {#snippet template({
    children: _,
    expandToggle: __,
    footer: ___,
    expanded: expandedProp,
    ...args
  })}
    {@const expanded = expandedProp ?? expandedState}
    <SideNavigation {...args} {expanded}>
      {#snippet logo()}
        <a
          href="/"
          aria-label="Launchpad Home"
          style="display: grid; grid-template-areas: 'logo';"
        >
          {#if expanded}
            <div
              aria-hidden="true"
              style="grid-area: logo;"
              transition:cssControlledFade={{
                durationVar: "--transition-duration-side-navigation",
                easingVar: "--transition-easing-side-navigation",
              }}
            >
              <LaunchpadLogoText />
            </div>
          {/if}
          <div aria-hidden="true" style="grid-area: logo;">
            <LaunchpadLogo />
          </div>
        </a>
      {/snippet}
      {#snippet expandToggle(toggleProps)}
        <SideNavigation.ExpandToggle
          {...toggleProps}
          onclick={() => (expandedState = !expandedState)}
        />
      {/snippet}
      {#each { length: 60 }, i (i)}
        {@const Icon = icons[i % icons.length]}
        {#if i % 2}
          <SideNavigation.LinkItem href={`/item${i}`} selected={i === 1}>
            Link Item {i}
            {#snippet icon()}
              <Icon />
            {/snippet}
          </SideNavigation.LinkItem>
        {:else}
          <SideNavigation.ButtonItem>
            Button Item {i}
            {#snippet icon()}
              <Icon />
            {/snippet}
          </SideNavigation.ButtonItem>
        {/if}
      {/each}
      {#snippet footer()}
        <SideNavigation.ButtonItem>
          {#snippet icon()}
            <ColorPaletteIcon />
          {/snippet}
          Theme: Light
        </SideNavigation.ButtonItem>
        <SideNavigation.LinkItem href="/">
          {#snippet icon()}
            <UserIcon />
          {/snippet}
          $username
        </SideNavigation.LinkItem>
        <SideNavigation.ButtonItem>
          {#snippet icon()}
            <LogOutIcon />
          {/snippet}
          Logout
        </SideNavigation.ButtonItem>
      {/snippet}
    </SideNavigation>
  {/snippet}
</Story>
