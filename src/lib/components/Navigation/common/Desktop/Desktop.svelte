<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { ButtonItem } from "../items/ButtonItem/index.js";
  import type { DesktopProps } from "./types.js";

  const componentCssClassName = "ds desktop";

  let {
    class: className,
    children,
    logo,
    logoExpanded,
    footer,
    expanded = $bindable(),
    ...rest
  }: DesktopProps = $props();

  const navId = $props.id();
  let expandedChanged = $state(false);
  const initialExpanded = expanded;
  $effect(() => {
    if (expanded !== initialExpanded) {
      expandedChanged = true;
    }
  });
</script>

<header
  class={[componentCssClassName, className]}
  class:collapsed={!expanded}
  class:expanded-changed={expandedChanged}
  {...rest}
>
  <div class="logo logo-collapsed">
    {@render logo()}
  </div>
  <div class="logo logo-expanded">
    {@render logoExpanded()}
  </div>
  <ButtonPrimitive
    as="button"
    class="menu-toggle"
    onclick={() => {
      expanded = !expanded;
    }}
    aria-expanded={expanded}
    aria-controls={navId}
    aria-label={expanded ? "Collapse menu" : "Expand menu"}
  >
    <Icon name="expand-right" class="expand-icon" />
  </ButtonPrimitive>
  <nav id={navId}>
    {@render children?.()}
  </nav>
  {#if footer}
    <div class="footer">
      {@render footer()}
    </div>
  {/if}
</header>

<!-- @component
`Desktop` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Desktop class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Desktop>
```
-->

<style>
  .ds.desktop {
    width: var(--dimension-width-navigation-expanded-desktop);
    background-color: var(--color-background-navigation);
    --display-navigation-desktop: grid;

    position: sticky;
    top: 0;
    height: 100svh;
    display: grid;
    overflow: hidden;
    grid-template-columns:
      var(--dimension-padding-navigation-desktop)
      [logo-start content-start] var(
        --dimension-width-navigation-logo-column-desktop
      )
      [logo-end expanded-start] minmax(0, 1fr)
      [expanded-end] auto [content-end] var(
        --dimension-padding-navigation-desktop
      );
    grid-template-rows: [header-start] auto [header-end nav-start] 1fr [nav-end footer-start] auto [footer-end];

    transition: width var(--transition-duration-navigation)
      var(--transition-easing-navigation);

    .logo {
      grid-column: logo-start / span 2;

      &.logo-expanded {
        min-width: max-content;
      }

      &.logo-collapsed {
        display: none;
      }
    }

    nav {
      grid-row: nav;
      grid-column: 1 / -1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: subgrid;

      margin-block-start: var(
        --dimension-padding-block-start-navigation-nav-desktop
      );
    }

    &.expanded-changed nav {
      /* Do not fade on first render */
      animation: fadeIn var(--transition-duration-navigation)
        var(--transition-easing-navigation) forwards;
    }

    .footer {
      grid-row: footer;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }

    :global(.menu-toggle) {
      display: grid;
      place-items: center;
      grid-row: header;
      grid-column: 4;
      --border-style-button: none;
      --color-background-button: transparent;
    }
  }

  @media (scripting: enabled) {
    .ds.desktop.collapsed {
      width: calc(
        var(--dimension-width-navigation-logo-column-desktop) +
          var(--dimension-padding-navigation-desktop) * 2
      );

      nav {
        animation: disappear var(--transition-duration-navigation)
          var(--transition-easing-navigation) forwards;
      }

      :global {
        .menu-toggle {
          grid-row: nav;
          grid-column: 1 / -1;

          grid-template-columns: subgrid;
          align-self: self-start;

          margin-block-start: var(--tmp-dimension-spacing-block-m);
          padding-block: var(--tmp-dimension-spacing-block-xs);

          .ds.icon {
            grid-column: logo;
          }
        }

        .navigation-item .label {
          text-overflow: clip;
          animation: hide var(--transition-duration-navigation)
            var(--transition-easing-navigation) forwards;
        }
      }
    }
  }

  @keyframes disappear {
    to {
      opacity: 0;
      display: none;
    }
  }

  @keyframes hide {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
