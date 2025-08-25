<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { EventProps } from "./types.js";

  const componentCssClassName = "ds event";

  let {
    class: className,
    children,
    marker,
    titleRow,
    ...rest
  }: EventProps = $props();
</script>

<li class={[componentCssClassName, className]} {...rest}>
  <div class="marker" style:align-self={titleRow ? "center" : "start"}>
    {@render marker?.()}
  </div>
  {#if titleRow}
    <div class="content title-row">{@render titleRow()}</div>
  {/if}
  {#if children}
    <div class="content">{@render children()}</div>
  {/if}
</li>

<!-- @component
`Event` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Event class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Event>
```
-->

<style>
  .ds.event {
    --color-background-timeline-marker: var(--tmp-color-background-alt);
    --border-timeline-marker: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);
    --dimension-size-timeline-marker-empty: var(--tmp-dimension-size-xxxs);
    --dimension-gap-row-timeline-event: var(--tmp-dimension-spacing-block-xs);

    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: var(--dimension-gap-row-timeline-event);

    > .marker {
      grid-column: marker;
      justify-self: center;
      line-height: 0;

      &:empty {
        width: var(--dimension-size-timeline-marker-empty);
        height: var(--dimension-size-timeline-marker-empty);
        background-color: var(--color-background-timeline-marker);
        border: var(--border-timeline-marker);
      }
    }

    > .content {
      grid-column: content;
    }

    > .title-row {
      align-self: center;
    }
  }
</style>
