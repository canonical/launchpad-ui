<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Icon } from "$lib/components/Icon/index.js";
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import { iconNames } from "../Icon/iconNames.js";
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

  const icons = Array.from(iconNames);
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
        {#if i % 2}
          <SideNavigation.LinkItem href={`/item${i}`} selected={i === 1}>
            Link Item {i}
            {#snippet icon()}
              <Icon name={icons[i % icons.length]} />
            {/snippet}
          </SideNavigation.LinkItem>
        {:else}
          <SideNavigation.ButtonItem>
            Button Item {i}
            {#snippet icon()}
              <Icon name={icons[i % icons.length]} />
            {/snippet}
          </SideNavigation.ButtonItem>
        {/if}
      {/each}
      {#snippet footer()}
        <SideNavigation.ButtonItem>
          {#snippet icon()}
            <Icon name="color-palette" />
          {/snippet}
          Theme: Light
        </SideNavigation.ButtonItem>
        <SideNavigation.LinkItem href="/">
          {#snippet icon()}
            <Icon name="user" />
          {/snippet}
          $username
        </SideNavigation.LinkItem>
        <SideNavigation.ButtonItem>
          {#snippet icon()}
            <Icon name="log-out" />
          {/snippet}
          Logout
        </SideNavigation.ButtonItem>
      {/snippet}
    </SideNavigation>
  {/snippet}
</Story>
