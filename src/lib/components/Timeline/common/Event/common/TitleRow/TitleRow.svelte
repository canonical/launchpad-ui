<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { TitleRowProps } from "./types.js";

  const componentCssClassName = "ds title-row";

  let {
    class: className,
    children,
    leadingText,
    date,
    ...rest
  }: TitleRowProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="title-row"
  {...rest}
>
  <span class="content">
    {#if leadingText}
      <span class="leading-text">{leadingText}</span>
    {/if}
    <span class="description">
      {@render children()}
    </span>
  </span>
  <span class="date">{@render date()}</span>
</div>

<!-- @component
`Timeline.Event.TitleRow` is used to display a title row within a timeline event.

## Example Usage
```svelte
<Timeline.Event.TitleRow leadingText="Alvarez Daniella">
  added labels: Don't merge, Maintenance, Review: QA needed
  {#snippet date()}
    <DateTime date="2023-03-15" />
  {/snippet}
</Timeline.Event.TitleRow>
```
-->

<style>
  .ds.title-row {
    --typography-timeline-event-title-row: var(--lp-typography-paragraph-s);
    --color-text-timeline-event-title-row-leading-text: var(
      --lp-color-text-default
    );
    --color-text-timeline-event-title-row-date: var(--lp-color-text-muted);
    --color-text-timeline-event-title-row-description: var(
      --lp-color-text-muted
    );
    --dimension-gap-timeline-event-title-row: var(
      --lp-dimension-spacing-inline-xs
    );
    /* TODO(@Enzo): Add a missing token */
    --dimension-basis-timeline-event-title-row-description: 10rem;

    display: flex;
    align-items: baseline;

    font: var(--typography-timeline-event-title-row);
    line-height: var(--typography-line-height-timeline-event-title-row);
    gap: var(--dimension-gap-timeline-event-title-row);

    > .content {
      display: flex;
      flex-grow: 1;
      align-items: baseline;
      flex-wrap: wrap;

      gap: var(--dimension-gap-timeline-event-title-row);

      > .leading-text {
        color: var(--color-text-timeline-event-title-row-leading-text);
      }

      > .description {
        color: var(--color-text-timeline-event-title-row-description);
        flex-basis: var(--dimension-basis-timeline-event-title-row-description);
        flex-grow: 1;
      }
    }

    > .date {
      color: var(--color-text-timeline-event-title-row-date);
      flex: none;
    }
  }
</style>
