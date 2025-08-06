<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { CollapsedItems, ExpandedItems } from "./common/index.js";
  import type { BreadcrumbsProps, PossiblyHiddenSegment } from "./types.js";

  const componentCssClassName = "ds breadcrumbs";

  const {
    class: className,
    segments,
    minNumExpanded = 1,
    ...rest
  }: BreadcrumbsProps = $props();

  const maxNumCollapsed = $derived(
    minNumExpanded === "all"
      ? 0
      : Math.max(0, segments.length - Math.max(0, minNumExpanded)),
  );
  let containerWidth = $state<number>();
  let segmentWidths = $state<number[]>([]);

  const [collapsed, expanded] = $derived.by(
    (): [
      collapsed: PossiblyHiddenSegment[],
      expanded: PossiblyHiddenSegment[],
    ] => {
      if (
        // Bail out if we don't want to collapse any segments before reading `containerWidth` or `segmentWidths`
        // This way `$derived` won't rerun unnecessarily when the widths change
        maxNumCollapsed === 0 ||
        // We have not measured the container width yet
        containerWidth === undefined
      ) {
        // No segments are collapsed
        return [[], segments];
      }

      let expandedWidth = segmentWidths
        // When the number of segments passed as a prop decreases, the widths of the unmounted `li`s are not removed from the `segmentWidths`,
        // This makes sure, that we use the widths of the segments that are actually rendered in any given moment
        .slice(0, segments.length)
        .reduce((acc, width) => acc + width, 0);

      const collapsed: PossiblyHiddenSegment[] = [];
      let i = 0;
      // Move the segments from the start one by one to the collapsed list until we can fit the rest in the `containerWidth` or we have collapsed the maximum number of segments
      while (
        i < segments.length &&
        expandedWidth >= containerWidth &&
        i < maxNumCollapsed
      ) {
        collapsed.push({ ...segments[i], hidden: true });
        expandedWidth -= segmentWidths[i];
        i++;
      }

      // The rest of the segments are expanded
      const expanded = segments.slice(i);

      return [collapsed, expanded];
    },
  );
</script>

<nav
  aria-label="Breadcrumbs"
  class={[componentCssClassName, className]}
  {...rest}
>
  <ol>
    {#if collapsed.length > 0}
      <CollapsedItems segments={collapsed} hasCurrent={expanded.length === 0} />
    {/if}
    <ExpandedItems
      segments={[...collapsed, ...expanded]}
      bind:segmentWidths
      bind:containerWidth
      canCollapseMore={collapsed.length < maxNumCollapsed}
    />
  </ol>
</nav>

<!-- @component
`Breadcrumbs` is a navigation component used to display the current page's location within a navigational hierarchy. It allows users to easily navigate back to previous pages or sections.

## Example Usage
```svelte
<Breadcrumbs
  segments={[
    { label: "Project", href: "/launchpad" },
    { label: "Repository", href: "/launchpad/launchpad-ui" },
    {
      label: "Merge proposals",
      href: "/launchpad/launchpad-ui/merge-proposals",
    },
    {
      label: "475346: update ibugtarget for template",
      href: "/launchpad/launchpad-ui/merge-proposals/475346",
    },
  ]}
  minNumExpanded={2}
/>
```
-->

<style>
  .ds.breadcrumbs {
    --color-background-breadcrumbs-collapse-menu-default: var(
      --tmp-color-background-default
    );
    --color-background-breadcrumbs-collapse-menu-item-active: var(
      --tmp-color-background-active
    );
    --color-background-breadcrumbs-collapse-menu-item-default: var(
      --tmp-color-background-default
    );
    --color-background-breadcrumbs-collapse-menu-item-hover: var(
      --tmp-color-background-hover
    );
    --color-background-breadcrumbs-collapse-trigger-active: var(
      --tmp-color-background-active
    );
    --color-background-breadcrumbs-collapse-trigger-default: var(
      --tmp-color-background-default
    );
    --color-border-breadcrumbs-collapse-menu: var(
      --tmp-color-border-high-contrast
    );
    --color-text-breadcrumbs: var(--tmp-color-text-default);
    --color-text-link-breadcrumbs-link-default: var(
      --tmp-color-text-link-default
    );
    --color-text-link-breadcrumbs-link-visited: var(
      --tmp-color-text-link-visited
    );
    --dimension-border-width-breadcrumbs-collapse-menu: var(
      --dimension-stroke-thickness-default
    );
    --dimension-margin-inline-breadcrumbs-separator: var(
      --tmp-dimension-spacing-inline-xxs
    );
    --dimension-margin-top-breadcrumbs-collapse-menu: var(
      --tmp-dimension-spacing-block-xxs
    );
    --dimension-min-width-breadcrumbs-collapse-menu: min(17rem, 100vw);
    --dimension-padding-block-breadcrumbs-collapse-menu-item: var(
      --tmp-dimension-spacing-block-xxs
    );
    --dimension-padding-block-breadcrumbs-collapse-menu: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-padding-block-breadcrumbs: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-padding-inline-breadcrumbs-collapse-menu-item: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-inline-breadcrumbs-collapse-trigger: var(
      --tmp-dimension-spacing-inline-s
    );
    --dimension-padding-inline-breadcrumbs: var(
      --tmp-dimension-spacing-inline-l
    );
    --typography-font-breadcrumbs: var(--tmp-typography-paragraph-s);

    --border-breadcrumbs-collapse-menu: var(
        --dimension-border-width-breadcrumbs-collapse-menu
      )
      solid var(--color-border-breadcrumbs-collapse-menu);

    font: var(--typography-font-breadcrumbs);
    color: var(--color-text-breadcrumbs);
    padding-inline: var(--dimension-padding-inline-breadcrumbs);
    padding-block: var(--dimension-padding-block-breadcrumbs);

    > ol {
      display: flex;
      align-items: start;
      justify-content: flex-start;

      :global(.ds.collapsed-items + .ds.expanded-items li::before) {
        /* Show separator before all the segments if there is a collapse section */
        content: "/" / "";
        margin-inline: var(--dimension-margin-inline-breadcrumbs-separator);
      }
    }

    :global(ol) {
      list-style: none;
    }
  }
</style>
