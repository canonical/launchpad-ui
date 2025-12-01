<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { EventProps } from "./types.js";

  const componentCssClassName = "ds event";

  let {
    class: className,
    children,
    marker,
    markerSize = "small",
    titleRow,
    ...rest
  }: EventProps = $props();
</script>

<li
  class={[
    componentCssClassName,
    className,
    marker === undefined
      ? "marker-empty"
      : markerSize === "small"
        ? "marker-small"
        : "marker-large",
    { "with-title-row": titleRow },
  ]}
  {...rest}
>
  <div class="marker" aria-hidden="true">
    {#if typeof marker === "function"}
      {@const Icon = marker}
      <Icon />
    {:else if marker}
      <UserAvatar {...marker} />
    {/if}
  </div>
  {#if children || titleRow}
    <div class="content">
      {#if titleRow}
        <div class="title-row">
          {@render titleRow?.()}
        </div>
      {/if}
      {#if children}
        <div>
          {@render children()}
        </div>
      {/if}
    </div>
  {/if}
</li>

<!-- @component
`Timeline.Event` is a component that represents a single event on the timeline. It displays a marker that can optionally show an icon or an avatar (both can either be `small` or `large`).

The marker and the first line of the optional `titleRow` are meant to be aligned vertically. This is automatically handled if `<Timeline.Event.TitleRow>` is used. If you wish to provide other content and want this behavior to persist, override `--typography-line-height-timeline-event-title-row` CSS variable with the line height of your content.

## Example Usage
```svelte
<Timeline.Event marker="flag" markerSize="small">
  {#snippet titleRow()}
    <Timeline.Event.TitleRow
      leadingText="Alvarez Daniella"
    >
      did something
      {#snippet date()}
        <DateTime date="2023-03-15" />
      {/snippet}
    </Timeline.Event.TitleRow>
  {/snippet}
  and here is some additional content.
</Timeline.Event>
```
-->

<style>
  .ds.event {
    /* Marker */
    --color-background-timeline-marker: var(--tmp-color-background-alt);
    --border-timeline-marker: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);
    --dimension-size-timeline-marker-empty: var(--tmp-dimension-size-xxxs);
    --dimension-size-timeline-marker-small: var(--tmp-dimension-size-s);
    --dimension-size-timeline-marker-large: var(--tmp-dimension-size-l);

    /* Title row */
    --dimension-margin-block-end-timeline-event-title-row: var(
      --tmp-dimension-spacing-block-xs
    );
    --typography-line-height-timeline-event-title-row: var(
      --tmp-typography-line-height-s
    );

    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: 1fr;

    > * {
      grid-row: 1;
    }

    &.marker-small {
      --marker-size: var(--dimension-size-timeline-marker-small);
    }

    &.marker-large {
      --marker-size: var(--dimension-size-timeline-marker-large);
    }

    &.marker-empty {
      --marker-size: var(--dimension-size-timeline-marker-empty);
    }

    &.with-title-row {
      /* Only calculate this if necessary */
      --marker-title-row-alignment-difference: calc(
        var(--typography-line-height-timeline-event-title-row) / 2 -
          var(--marker-size) / 2
      );

      /* If the marker is bigger that the title row, there's no need to adjust its alignment */
      --marker-alignment-adjustment: max(
        var(--marker-title-row-alignment-difference),
        0px
      );
    }

    &:not(.with-title-row) {
      /* One fallback, instead of specifying 0px as an alternative in every `var()` */
      --marker-title-row-alignment-difference: 0px;
      --marker-alignment-adjustment: 0px;
    }

    &::before {
      content: "";
      display: block;
      grid-column: marker;
      grid-row: 1;
      background-color: var(--color-background-timeline-line);
      width: var(--dimension-width-timeline-line);
      justify-self: center;

      /* Span the whole height of the event and reach over the gap to the next one */
      height: calc(100% + var(--dimension-gap-row-timeline));
    }

    &:first-child::before {
      /* Start the line at the marker */
      height: calc(
        100% + var(--dimension-gap-row-timeline) -
          var(--marker-alignment-adjustment)
      );
      margin-block-start: var(--marker-alignment-adjustment);
    }

    &:last-child::before {
      /* End the line at the marker */
      height: var(--marker-alignment-adjustment);
    }

    > .marker {
      grid-column: marker;
      justify-self: center;
      display: grid;
      place-content: center;
      align-self: start;

      width: var(--marker-size);
      height: var(--marker-size);
      border: var(--border-timeline-marker);
      background-color: var(--color-background-timeline-marker);

      margin-block-start: var(--marker-alignment-adjustment);

      :global(.ds.user-avatar) {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
      }
    }

    > .content {
      grid-column: content;
      align-self: start;

      > .title-row {
        /* If the title row is bigger than the marker, no adjustment is needed */
        margin-block-start: max(
          calc(var(--marker-title-row-alignment-difference) * -1),
          0px
        );

        &:not(:only-child) {
          margin-block-end: var(
            --dimension-margin-block-end-timeline-event-title-row
          );
        }
      }
    }
  }
</style>
