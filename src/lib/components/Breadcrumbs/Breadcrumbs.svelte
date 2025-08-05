<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { onMount } from "svelte";
  import type {
    BreadcrumbsProps,
    PossiblyHiddenSegment,
    Segment,
  } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds breadcrumbs";

  const {
    class: className,
    segments,
    keepExpanded = 1,
    ...rest
  }: BreadcrumbsProps = $props();

  const maxNumCollapsed = $derived(
    keepExpanded === "all"
      ? 0
      : Math.max(0, segments.length - Math.max(0, keepExpanded)),
  );
  let containerWidth = $state<number>();
  const segmentWidths = $state<number[]>([]);

  const [collapsed, expanded] = $derived.by(
    (): [
      collapsed: PossiblyHiddenSegment[],
      expanded: PossiblyHiddenSegment[],
    ] => {
      if (
        // Bail out if we don't want to collapse any segments
        // before reading `containerWidth` or `segmentWidths`
        // This way `$derived` won't rerun unnecessarily when the widths change
        maxNumCollapsed === 0 ||
        // We have not measured the container width yet
        containerWidth === undefined
      ) {
        // No segments are collapsed
        return [[], segments];
      }

      let expandedWidth = segmentWidths
        // When the number of segments passed as a prop decreases,
        // the widths of the unmounted `li`s are not removed from the `segmentWidths`,
        // This makes sure, that we use the widths of the segments
        // that are actually rendered in any given moment
        .slice(0, segments.length)
        .reduce((acc, width) => acc + width, 0);

      const collapsed: PossiblyHiddenSegment[] = [];
      let i = 0;
      // Move the segments from the start one by one to the collapsed list
      // until we can fit the rest in the `containerWidth`
      // or we have collapsed the maximum number of segments
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

  // This only keeps track of whether the menu opened by clicking on the trigger
  // Focus and hover-triggered opening is handled 100% in CSS
  let collapseClickOpened = $state(false);

  let mounted = $state(false);
  onMount(() => (mounted = true));
  const wrapExpanded = $derived(
    // Allow wrapping of the expanded segments if JavaScript is not available
    // or we have already collapsed all there is to collapse
    !mounted || collapsed.length === maxNumCollapsed,
  );
</script>

<svelte:window
  onclick={() => (collapseClickOpened = false)}
  onkeydown={(e) => {
    if (e.key === "Escape") {
      collapseClickOpened = false;
    }
  }}
/>

<nav
  aria-label="Breadcrumbs"
  class={[componentCssClassName, className]}
  {...rest}
>
  <ol>
    {#if collapsed.length > 0}
      <!-- This doesn't need keyboard navigation, as the links inside themselves are always tab-focusable. The click handler is for sighted use of touch devices on which hover does not exist -->

      <li
        role="none"
        class="collapsed"
        class:open={collapseClickOpened}
        onclick={(e) => {
          if (e.target !== e.currentTarget) return;
          e.stopPropagation();
          collapseClickOpened = !collapseClickOpened;
        }}
      >
        <ol role="none" data-testid="collapsed-segments">
          {#each collapsed as segment, i (i)}
            <li role="listitem">
              {@render item(segment, i === segments.length - 1)}
            </li>
          {/each}
        </ol>
      </li>
    {/if}
    <li
      role="none"
      class="expanded"
      style:white-space={wrapExpanded ? "normal" : "nowrap"}
      bind:clientWidth={containerWidth}
    >
      <ol role="none">
        {#each [...collapsed, ...expanded] as segment, i (i)}
          <li
            role="listitem"
            bind:offsetWidth={segmentWidths[i]}
            class:hidden={segment.hidden}
            aria-hidden={segment.hidden}
          >
            {@render item(segment, i === segments.length - 1)}
          </li>
        {/each}
      </ol>
    </li>
  </ol>
</nav>

{#snippet item(segment: Segment, current: boolean)}
  {#if segment.href}
    <a href={segment.href} aria-current={current ? "page" : undefined}>
      {segment.label}
    </a>
  {:else}
    <span aria-current={current ? "page" : undefined}>{segment.label}</span>
  {/if}
{/snippet}

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
  keepExpanded={2}
/>
```
-->
