<script lang="ts">
  import { ChevronRightIcon } from "@canonical/svelte-icons";
  import { getAccordionContext } from "../../context.js";
  import type { ItemProps } from "./types.js";
  import "../../styles.css";

  const componentCssClassName = "ds accordion-item";

  let {
    class: className,
    open = $bindable(false),
    heading,
    contentBreakout = false,
    children,
    ...rest
  }: ItemProps = $props();

  const ctx = getAccordionContext();
</script>

<details
  bind:open
  name={ctx?.name}
  class={[componentCssClassName, className]}
  {...rest}
>
  <summary>
    <div class="chevron-wrapper">
      <ChevronRightIcon class="chevron" aria-hidden="true" />
    </div>

    <div class="heading">
      {#if typeof heading === "string"}
        {heading}
      {:else}
        {@render heading?.()}
      {/if}
    </div>
  </summary>
  <div class="content" class:content-breakout={contentBreakout}>
    {@render children?.()}
  </div>
</details>

<style>
  .ds.accordion-item {
    --transition-duration-accordion: var(--lp-transition-duration-fast);
    --transition-timing-accordion: var(--lp-transition-timing-ease-out);

    font: var(--lp-typography-paragraph-default);
    border-block-end: var(--lp-dimension-stroke-thickness-default) solid
      var(--lp-color-border-default);

    &::details-content {
      block-size: 0;
      opacity: 0;
      overflow: clip;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      align-items: center;
      transform: translateY(calc(-1 * var(--lp-dimension-spacing-block-xs)));
      transition:
        content-visibility var(--transition-duration-accordion)
          var(--transition-timing-accordion),
        opacity var(--transition-duration-accordion)
          var(--transition-timing-accordion),
        block-size var(--transition-duration-accordion)
          var(--transition-timing-accordion),
        transform var(--transition-duration-accordion)
          var(--transition-timing-accordion);
      transition-behavior: allow-discrete;
      interpolate-size: allow-keywords;
    }

    summary {
      cursor: pointer;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      padding-block: var(--lp-dimension-spacing-block-xs);
      transition: background-color var(--lp-transition-duration-snap)
        var(--lp-transition-timing-ease-in);

      list-style: none;
      &::marker {
        display: none;
      }
      &::-webkit-details-marker {
        display: none;
      }

      &:hover {
        background-color: var(--lp-color-background-hover);
      }

      &:active {
        background-color: var(--lp-color-background-active);
      }

      .heading {
        grid-column: content-start / -1;
        padding-inline-end: var(--padding-inline-accordion);
      }
    }

    .chevron-wrapper {
      grid-column: marker;
      block-size: var(--line-height-accordion-item-heading, 1lh);
      inline-size: 1em;
      display: grid;
      place-content: center;
      justify-self: center;
    }

    :global(.chevron) {
      transition: transform var(--transition-duration-accordion)
        var(--transition-timing-accordion);
    }

    &:is(:open, [open]) {
      &::details-content {
        block-size: auto;
        opacity: 1;
        transform: translateY(0);
        padding-block-start: var(--lp-dimension-spacing-block-xs);
        padding-block-end: var(--lp-dimension-spacing-block-m);
      }

      :global(.chevron) {
        transform: rotate(90deg);
      }
    }

    .content {
      grid-column: content;

      &.content-breakout {
        display: contents;
      }
    }
  }
</style>
