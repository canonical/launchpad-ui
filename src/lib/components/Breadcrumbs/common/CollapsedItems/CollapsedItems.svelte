<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { Item } from "../common/index.js";
  import type { CollapsedItemsProps } from "./types.js";

  const componentCssClassName = "ds collapsed-items";

  let { segments, hasCurrent }: CollapsedItemsProps = $props();

  // This only keeps track of whether the menu opened by clicking on the trigger
  // Focus and hover-triggered opening is handled 100% in CSS
  let collapseClickOpened = $state(false);
</script>

<svelte:window
  onclick={() => (collapseClickOpened = false)}
  onkeydown={(e) => {
    if (e.key === "Escape") {
      collapseClickOpened = false;
    }
  }}
/>

<!-- This doesn't need keyboard navigation, as the links inside themselves are always tab-focusable. The click handler is for sighted use of touch devices on which hover does not exist -->
<li
  role="none"
  class={componentCssClassName}
  class:open={collapseClickOpened}
  onclick={(e) => {
    if (e.target !== e.currentTarget) return;
    e.stopPropagation();
    collapseClickOpened = !collapseClickOpened;
  }}
>
  <ol role="none" data-testid="collapsed-segments">
    {#each segments as segment, i (i)}
      <li role="listitem">
        <Item {segment} current={hasCurrent && i === segments.length - 1} />
      </li>
    {/each}
  </ol>
</li>

<style>
  .ds.collapsed-items {
    position: relative;

    border: var(--border-breadcrumbs-collapse-menu);
    padding-inline: var(
      --dimension-padding-inline-breadcrumbs-collapse-trigger
    );
    background-color: var(
      --color-background-breadcrumbs-collapse-trigger-default
    );

    &::before {
      content: "..." / "";
    }

    :global(.ds.item) {
      display: block;

      padding-block: var(
        --dimension-padding-block-breadcrumbs-collapse-menu-item
      );
      padding-inline: var(
        --dimension-padding-inline-breadcrumbs-collapse-menu-item
      );
    }

    :global(.ds.item) {
      &:hover {
        background-color: var(
          --color-background-breadcrumbs-collapse-menu-item-hover
        );
      }

      &:active {
        background-color: var(
          --color-background-breadcrumbs-collapse-menu-item-active
        );
      }
    }

    > ol {
      left: calc(var(--dimension-border-width-breadcrumbs-collapse-menu) * -1);
      display: flex;
      flex-direction: column;
      position: absolute;
      /* `visibility: hidden` hides the elements from tab navigation, which is not what we want */
      opacity: 0;
      pointer-events: none;

      padding-block: var(--dimension-padding-block-breadcrumbs-collapse-menu);
      min-width: var(--dimension-min-width-breadcrumbs-collapse-menu);
      margin-top: var(--dimension-margin-top-breadcrumbs-collapse-menu);
    }

    &:focus-within,
    &:hover,
    &.open {
      background-color: var(
        --color-background-breadcrumbs-collapse-trigger-active
      );

      > ol {
        opacity: 1;
        pointer-events: auto;

        border: var(--border-breadcrumbs-collapse-menu);
        background: var(--color-background-breadcrumbs-collapse-menu-default);
      }

      &::after {
        /* This is to not to lose hover when moving the mouse overt the gap to the child <ol> */
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;

        height: var(--dimension-margin-top-breadcrumbs-collapse-menu);
      }
    }
  }
</style>
