<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { HiddenEventsProps } from "./types.js";

  const componentCssClassName = "ds hidden-events";

  let {
    class: className,
    numHidden,
    showMoreHref,
    showAllHref,
    ...rest
  }: HiddenEventsProps = $props();
</script>

<li class={[componentCssClassName, className]} {...rest}>
  <div>
    <span>
      {numHidden} hidden
    </span>
    <!-- TODO: Replace with <Link /> -->
    {#if showMoreHref}
      <span class="link-separator" aria-hidden="true"></span>
      <a href={showMoreHref}>Show more</a>
    {/if}
    {#if showAllHref}
      <span class="link-separator" aria-hidden="true"></span>
      <a href={showAllHref}>Show all</a>
    {/if}
  </div>
</li>

<!-- @component
`HiddenEvents` component provides a way to inform the user, that not all events are visible in the timeline. It displays a message indicating the number of events hidden from the view and optionally allows the user to display more or all the hidden events.

## Example Usage
```svelte
<Timeline.HiddenEvents numHidden={888} showMoreHref="?showMore" showAllHref="?showAll" />
```
-->

<style>
  .ds.hidden-events {
    --border-block-timeline-hidden-events: var(
        --dimension-stroke-thickness-default
      )
      solid var(--tmp-color-border-default);
    --dimension-padding-block-timeline-hidden-events: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-padding-inline-timeline-hidden-events: var(
      --tmp-dimension-spacing-inline-m
    );

    --typography-timeline-hidden-events-text: var(
      --tmp-typography-paragraph-xs-strong
    );
    --typography-timeline-hidden-events-links: var(
      --tmp-typography-paragraph-xs
    );
    --dimension-gap-timeline-hidden-events: var(
      --tmp-dimension-spacing-inline-xs
    );
    --color-text-timeline-hidden-events-links-separator: var(
      --tmp-color-text-muted
    );

    /* TODO: Should be handled by <Link> */
    --color-text-timeline-hidden-events-links: var(
      --tmp-color-text-link-default
    );

    position: relative;
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    font: var(--typography-timeline-hidden-events-text);

    &:not(:last-child)::after {
      /* Line spanning to the next element */
      content: "";
      position: absolute;
      display: block;
      grid-column: marker;
      background-color: var(--color-background-timeline-line);
      width: var(--dimension-width-timeline-line);
      justify-self: center;
      height: var(--dimension-gap-row-timeline);
      top: 100%;
    }

    > div {
      grid-column: 1 / -1;
      justify-self: start;
      display: flex;
      align-items: center;
      gap: var(--dimension-gap-timeline-hidden-events);
      padding-block: var(--dimension-padding-block-timeline-hidden-events);
      padding-inline: var(--dimension-padding-inline-timeline-hidden-events);
      border-block: var(--border-block-timeline-hidden-events);
    }

    &:first-child {
      > div {
        border-block-start: none;
      }
    }

    &:last-child {
      > div {
        border-block-end: none;
      }
    }

    a {
      text-decoration: none;
      font: var(--typography-timeline-hidden-events-links);
      color: var(--color-text-timeline-hidden-events-links);

      &:hover {
        text-decoration: underline;
      }
    }

    .link-separator::before {
      /* Can't be on links, as it would get underlined on hover */
      content: "•" / "";
      color: var(--color-text-timeline-hidden-events-links-separator);
    }
  }
</style>
