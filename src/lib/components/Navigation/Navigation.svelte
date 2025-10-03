<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Desktop, Mobile } from "./common/index.js";
  import type { NavigationProps } from "./types.js";

  const componentCssClassName = "ds navigation";

  let {
    class: className,
    desktopThreshold,
    logo,
    logoExpanded,
    navigation,
    footer,
    children,
    expanded = $bindable(true),
    ...rest
  }: NavigationProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  <Desktop {logo} {logoExpanded} {footer} bind:expanded>
    {@render navigation()}
  </Desktop>
  <Mobile logo={logoExpanded ?? logo}>
    {@render navigation()}
    {@render footer?.()}
  </Mobile>
  {@render children?.()}
  <!-- TODO: This works, but is this the best way to have no-JS props-based media queries? -->
  <style media="(min-width: {desktopThreshold}px)">
    .ds.navigation {
      display: grid;
      grid-template-columns: auto 1fr;

      > .ds.mobile {
        display: none;
      }

      > .ds.desktop {
        display: var(--display-navigation-desktop);
      }
    }
  </style>
</div>

<!-- @component
`Navigation` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Navigation class="custom-class" id="unique-id">
  <p>Content goes here</p
</Navigation>
```
-->

<style>
  .ds.navigation {
    /* Common */
    --color-background-navigation: var(--tmp-color-background-alt);
    --transition-duration-navigation: var(--tmp-transition-duration-brisk);
    --transition-easing-navigation: var(--tmp-transition-timing-ease-out);

    /* Desktop */
    --dimension-padding-navigation-desktop: var(
      --tmp-dimension-spacing-inline-s
    );
    --dimension-width-navigation-logo-column-desktop: 21px;
    --dimension-width-navigation-expanded-desktop: 240px;
    --dimension-padding-block-start-navigation-nav-desktop: 40px;

    :global(> .desktop) {
      display: none;
    }
  }
</style>
