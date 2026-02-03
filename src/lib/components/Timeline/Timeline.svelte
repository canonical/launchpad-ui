<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { TimelineProps } from "./types.js";

  const componentCssClassName = "ds timeline";

  let { class: className, children, ...rest }: TimelineProps = $props();
</script>

<ol class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</ol>

<!-- @component
`Timeline` component represents a vertical timeline that displays a series of events in chronological order.

## Example Usage
```svelte
<Timeline>
  <Timeline.Event marker={{userName: "Alvarez Daniella"}} markerSize="large">
    {#snippet titleRow()}
      <Timeline.TitleRow leadingText="Alvarez Daniella">
        did some cool stuff
        {#snippet date()}
          <DateTime date="2023-03-15" />
        {/snippet}
      </Timeline.TitleRow>
    {/snippet}
    Description of the stuff that was done.
  </Timeline.Event>
  <Timeline.Event marker="text">
    {#snippet titleRow()}
      <Timeline.TitleRow leadingText="Alvarez Daniella">
        did other amazing things
        {#snippet date()}
          <DateTime date="2023-03-15" />
        {/snippet}
      </Timeline.TitleRow>
    {/snippet}
  </Timeline.Event>
  <Timeline.HiddenEvents numHidden={3} showAllHref="?show-all" />
</Timeline>
```
-->

<style>
  .ds.timeline {
    --dimension-gap-row-timeline: calc(var(--lp-dimension-spacing-block-s) * 2);
    --dimension-gap-column-timeline: var(--lp-dimension-spacing-inline-m);

    --color-background-timeline-line: var(--lp-color-border-default);
    --dimension-width-timeline-line: var(--dimension-stroke-thickness-default);

    display: grid;
    grid-template-columns: [marker-start] auto [marker-end content-start] 1fr [content-end];
    list-style: none;

    row-gap: var(--dimension-gap-row-timeline);
    column-gap: var(--dimension-gap-column-timeline);
  }
</style>
