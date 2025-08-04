<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { onMount } from "svelte";
  import type { BreadcrumbsProps, Segment } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds breadcrumbs";

  const {
    class: className,
    segments,
    collapse = "none",
    ...rest
  }: BreadcrumbsProps = $props();

  const maxNumCollapsed = $derived(
    collapse === "all" ? segments.length : collapse === "none" ? 0 : collapse,
  );
  let containerWidth = $state<number>();
  const segmentWidths = $state<number[]>([]);

  type HiddenSegment = Segment & {
    hidden?: boolean;
  };
  const [collapsed, expanded] = $derived.by(
    (): [HiddenSegment[], HiddenSegment[]] => {
      if (collapse === "none" || containerWidth === undefined)
        return [[], segments];

      let expandedWidth = segmentWidths
        .slice(0, segments.length)
        .reduce((acc, width) => acc + width, 0);
      if (expandedWidth < containerWidth) return [[], segments];

      const collapsed: HiddenSegment[] = [];
      let i = 0;
      while (
        i < segments.length &&
        expandedWidth >= containerWidth &&
        i < maxNumCollapsed
      ) {
        collapsed.push({ ...segments[i], hidden: true });
        expandedWidth -= segmentWidths[i];
        i++;
      }
      const expanded = segments.slice(i);

      return [collapsed, expanded];
    },
  );

  let collapseClickOpened = $state(false);
  let mounted = $state(false);
  onMount(() => (mounted = true));
</script>

<svelte:window onclick={() => (collapseClickOpened = false)} />

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
        <ol role="none">
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
      class:no-wrap={mounted &&
        collapse !== "none" &&
        collapsed.length < maxNumCollapsed}
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
    <span>{segment.label}</span>
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
  collapse={3}
/>
```
-->
