<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Link } from "$lib/components/Link/index.js";
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
    {#if showMoreHref}
      <span class="link-separator" aria-hidden="true"></span>
      <Link href={showMoreHref} class="show-link">Show more</Link>
    {/if}
    {#if showAllHref}
      <span class="link-separator" aria-hidden="true"></span>
      <Link href={showAllHref} class="show-link">Show all</Link>
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
      solid var(--lp-color-border-default);
    --dimension-padding-block-timeline-hidden-events: var(
      --lp-dimension-spacing-block-xs
    );
    --dimension-padding-inline-timeline-hidden-events: var(
      --lp-dimension-spacing-inline-m
    );

    --typography-timeline-hidden-events-text: var(
      --lp-typography-paragraph-xs-strong
    );
    --typography-timeline-hidden-events-links: var(
      --lp-typography-paragraph-xs
    );
    --dimension-gap-timeline-hidden-events: var(
      --lp-dimension-spacing-inline-xs
    );
    --color-text-timeline-hidden-events-links-separator: var(
      --lp-color-text-muted
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

    :global(.show-link) {
      font: var(--typography-timeline-hidden-events-links);
    }

    .link-separator::before {
      /* Can't be on links, as it would get underlined on hover */
      content: "•" / "";
      color: var(--color-text-timeline-hidden-events-links-separator);
    }
  }
</style>
