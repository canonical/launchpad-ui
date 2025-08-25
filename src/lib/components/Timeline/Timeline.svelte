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
`Timeline` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Timeline class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Timeline>
```
-->

<style>
  .ds.timeline {
    --color-background-timeline: var(--tmp-color-background-default);
    --color-background-timeline-line: var(--tmp-color-border-default);
    --dimension-width-timeline-line: var(--dimension-stroke-thickness-default);
    --dimension-gap-row-timeline: calc(
      var(--tmp-dimension-spacing-block-s) * 2
    );
    --dimension-gap-column-timeline: var(--tmp-dimension-spacing-inline-m);

    display: grid;
    position: relative;
    isolation: isolate;
    grid-template-columns: [marker-start] auto [marker-end content-start] 1fr [content-end];

    background-color: var(--color-background-timeline);
    column-gap: var(--dimension-gap-column-timeline);
    row-gap: var(--dimension-gap-row-timeline);
    padding-block-end: var(--dimension-gap-row-timeline);

    &::before {
      content: "";
      display: block;
      position: absolute;
      grid-column: marker;
      background-color: var(--color-background-timeline-line);
      width: var(--dimension-width-timeline-line);
      justify-self: center;
      height: 100%;
      z-index: -1;
    }
  }
</style>
