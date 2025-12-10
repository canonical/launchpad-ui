<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { cssControlledFade } from "$lib/transitions/cssControlledFade.js";
  import type { SideNavigationProps } from "./types.js";

  const componentCssClassName = "ds side-navigation";

  let {
    class: className,
    children,
    logo,
    footer,
    expandToggle,
    expanded = true,
    ...rest
  }: SideNavigationProps = $props();

  const navId = $props.id();

  // We need to track if expanded has changed from its initial value to avoid animating on first render
  let expandedChanged = $state(false);
  // svelte-ignore state_referenced_locally
  const initialExpanded = expanded;
  $effect.pre(() => {
    if (expanded !== initialExpanded) expandedChanged = true;
  });
</script>

<header
  class={[componentCssClassName, className]}
  class:collapsed={!expanded}
  class:expanded-changed={expandedChanged}
  {...rest}
>
  <div class="logo">
    {@render logo()}
  </div>
  {@render expandToggle?.({
    "aria-expanded": expanded,
    "aria-controls": navId,
    "aria-label": expanded ? "Collapse navigation" : "Expand navigation",
  })}
  {#if expanded}
    <nav
      id={navId}
      transition:cssControlledFade={{
        durationVar: "--transition-duration-side-navigation",
        easingVar: "--transition-easing-side-navigation",
      }}
    >
      {@render children?.()}
    </nav>
  {/if}
  {#if footer}
    <div class="footer">
      {@render footer()}
    </div>
  {/if}
</header>

<!-- @component
`SideNavigation` is the primary navigation component containing links to navigate between different sections of an application. The component can be expanded or collapsed (depending on the `expanded` prop).

The component has two sections:
- main navigation area (children) - it is hidden when component is collapsed;
- footer area (footer) - if component is collapsed, only icons are shown.

## Example Usage
```svelte
<script lang="ts">
  let expanded = $state(true);
</script>

<SideNavigation {expanded}>
  {#snippet logo()}
    <a href="/" aria-label="Home">
      <Logo />
    </a>
  {/snippet}
  {#snippet expandToggle(toggleProps)}
    <SideNavigation.ExpandToggle
      {...toggleProps}
      onclick={() => (expanded = !expanded)}
    />
  {/snippet}
  <SideNavigation.LinkItem href="/dashboard">
    {#snippet icon()}
      <Dashboard />
    {/snippet}
    Dashboard
  </SideNavigation.LinkItem>
  <SideNavigation.LinkItem href="/projects">
    {#snippet icon()}
      <Folder />
    {/snippet}
    Projects
  </SideNavigation.LinkItem>
  {#snippet footer()}
    <SideNavigation.ButtonItem onclick={doSomething}>
      {#snippet icon()}
        <ColorPalette />
      {/snippet}
      Theme
    </SideNavigation.ButtonItem>
    <SideNavigation.LinkItem href="/profile">
      {#snippet icon()}
        <User />
      {/snippet}
      John Doe
    </SideNavigation.LinkItem>
    <SideNavigation.ButtonItem onclick={doSomethingElse}>
      {#snippet icon()}
        <LogOut />
      {/snippet}
      Logout
    </SideNavigation.ButtonItem>
  {/snippet}
</SideNavigation>
```
-->

<style>
  .ds.side-navigation {
    --color-background-side-navigation: var(--tmp-color-background-alt);
    --transition-duration-side-navigation: var(--tmp-transition-duration-brisk);
    --transition-easing-side-navigation: var(--tmp-transition-timing-ease-out);
    --dimension-padding-side-navigation: var(--tmp-dimension-spacing-inline-s);
    /* 
    TODO: This "hardcoded" width could be get rid of when support for either:
     - `interpolate-size: allow-keywords` (https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size), or
     - `calc-size()` (https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) is there.
     Then the we could either transition the width of the whole grid container to e.g. `min-content` (with expanded grid track width being 0), or calculate its required collapsed width based on the intrinsic width of the logo column.
    */
    --dimension-width-side-navigation-logo-column: 21px;
    /* TODO(@Enzo): Missing token */
    --dimension-width-side-navigation-expanded: 240px;
    /* TODO(@Enzo): Missing token */
    --dimension-padding-block-start-side-navigation-nav: 40px;
    --dimension-padding-block-end-side-navigation-footer: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-padding-block-end-side-navigation-nav: var(
      --tmp-dimension-spacing-block-xxl
    );
    --dimension-padding-block-side-navigation-item: var(
      --tmp-dimension-spacing-block-xxs
    );
    --typography-side-navigation: var(--tmp-typography-paragraph-default);

    width: var(--dimension-width-side-navigation-expanded);
    background-color: var(--color-background-side-navigation);

    position: sticky;
    top: 0;
    height: 100dvh;
    display: grid;
    overflow: hidden;
    font: var(--typography-side-navigation);
    grid-template-columns:
      var(--dimension-padding-side-navigation)
      [logo-start content-start] var(
        --dimension-width-side-navigation-logo-column
      )
      [logo-end expanded-start] minmax(0, 1fr)
      [expanded-end] auto [content-end] var(
        --dimension-padding-side-navigation
      );
    grid-template-rows: [header-start] auto [header-end nav-start] 1fr [nav-end footer-start] auto [footer-end];

    transition: width var(--transition-duration-side-navigation)
      var(--transition-easing-side-navigation);

    > .logo {
      grid-column: logo-start / expanded-end;
      min-width: max-content;
      grid-row: header;
    }

    > nav {
      grid-row: nav;
      grid-column: 1 / -1;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: subgrid;
      place-content: start stretch;

      margin-block-start: var(
        --dimension-padding-block-start-side-navigation-nav
      );
      padding-block-end: var(--dimension-padding-block-end-side-navigation-nav);
      mask-image: linear-gradient(
        to top,
        transparent,
        black var(--dimension-padding-block-end-side-navigation-nav)
      );
    }

    > .footer {
      grid-row: footer;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;

      padding-block-end: var(
        --dimension-padding-block-end-side-navigation-footer
      );
    }

    :global {
      .ds.side-navigation-expand-toggle {
        grid-row: header;
        grid-column: expanded-end / content-end;
      }
    }
  }

  .ds.side-navigation.collapsed {
    width: calc(
      var(--dimension-width-side-navigation-logo-column) +
        var(--dimension-padding-side-navigation) * 2
    );

    :global {
      .ds.side-navigation-expand-toggle {
        grid-row: nav;
        grid-column: 1 / -1;

        grid-template-columns: subgrid;
        align-self: self-start;

        margin-block-start: var(--tmp-dimension-spacing-block-m);

        .expand-icon {
          grid-column: logo;
        }
      }
    }
  }

  /* Footer items fade */
  .ds.side-navigation {
    > .footer :global(.navigation-item > .label) {
      transition: opacity var(--transition-duration-side-navigation)
        var(--transition-easing-side-navigation);
    }

    &.expanded-changed > .footer :global(.navigation-item > .label) {
      @starting-style {
        opacity: 0;
      }
    }

    &.collapsed > .footer :global(.navigation-item > .label) {
      opacity: 0;
    }
  }
</style>
