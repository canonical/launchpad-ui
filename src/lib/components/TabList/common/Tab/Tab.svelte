<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { TabProps } from "./types.js";

  const componentCssClassName = "ds tab";

  let {
    id,
    class: className,
    children,
    style,
    active,
    ...rest
  }: TabProps = $props();
</script>

<li class={[componentCssClassName, className, { active }]} {id} {style}>
  <a aria-current={active ? "page" : undefined} {...rest}>
    {@render children?.()}
  </a>
</li>

<style>
  .ds.tab {
    --color-accent-tab-active: var(--lp-color-border-highlight);
    --color-accent-tab-hover: var(--lp-color-border-default);
    --color-accent-tab: var(--lp-color-border-default);
    --dimension-padding-block-tab: var(--lp-dimension-spacing-block-s);
    --dimension-padding-inline-tab: var(--lp-dimension-spacing-inline-m);
    --dimension-stroke-thickness-accent-tab-active: var(
      --dimension-stroke-thickness-large
    );
    --dimension-stroke-thickness-accent-tab-hover: var(
      --dimension-stroke-thickness-large
    );
    --dimension-stroke-thickness-accent-tab: var(
      --dimension-stroke-thickness-default
    );

    position: relative;
    cursor: pointer;
    flex: 0 0 auto;
    list-style: none;

    > a {
      display: inline-block;
      text-decoration: none;
      color: currentColor;
      padding-inline: var(--dimension-padding-inline-tab);
      padding-block: var(--dimension-padding-block-tab);
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: var(--dimension-stroke-thickness-accent-tab);
      background-color: var(--color-accent-tab);
    }

    &:hover {
      &::after {
        background-color: var(--color-accent-tab-hover);
        height: var(--dimension-stroke-thickness-accent-tab-hover);
      }
    }

    &.active,
    &:active {
      &::after {
        background-color: var(--color-accent-tab-active);
        height: var(--dimension-stroke-thickness-accent-tab-active);
      }
    }
  }
</style>
