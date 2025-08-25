<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { TitleRowProps } from "./types.js";

  const componentCssClassName = "ds title-row";

  let {
    class: className,
    children,
    trailingText,
    date,
    ...rest
  }: TitleRowProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {#if trailingText}
    <span class="trailing-text">{trailingText}</span>
  {/if}
  <span class="content">
    {@render children()}
  </span>
  <!-- TODO: Replace with <RelativeTime> -->
  <span class="date">{date.toLocaleDateString()}</span>
</div>

<!-- @component
`Timeline.TitleRow` is used to display a title row within a timeline event. 
  
## Example Usage
```svelte
<Timeline.TitleRow trailingText="Alvarez Daniella" date={new Date("2023-03-15")}>
  added labels: Don't merge, Maintenance, Review: QA needed
</Timeline.TitleRow>
```
-->

<style>
  .ds.title-row {
    --typography-timeline-title-row: var(--tmp-typography-paragraph-s);
    --color-text-timeline-title-row-trailing-text: var(
      --tmp-color-text-default
    );
    --color-text-timeline-title-row-date: var(--tmp-color-text-muted);
    --color-text-timeline-title-row-content: var(--tmp-color-text-muted);
    --dimension-gap-timeline-title-row: var(--tmp-dimension-spacing-inline-xs);

    font: var(--typography-timeline-title-row);
    display: flex;
    gap: var(--dimension-gap-timeline-title-row);

    > .trailing-text {
      color: var(--color-text-timeline-title-row-trailing-text);
      flex-shrink: 0;
    }

    > .date {
      color: var(--color-text-timeline-title-row-date);
      flex-shrink: 0;
    }

    > .content {
      color: var(--color-text-timeline-title-row-content);
      margin-inline-end: auto;
    }
  }
</style>
