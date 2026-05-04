<script lang="ts">
  import { ChevronRightIcon } from "@canonical/svelte-icons";
  import { getAccordionContext } from "../../context.js";
  import type { ItemProps } from "./types.js";

  const componentCssClassName = "ds accordion-item";

  let {
    class: className,
    open = $bindable(false),
    heading,
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
    <div class="summary-content">
      <ChevronRightIcon class="chevron" aria-hidden="true" />

      <div class="heading">
        {#if typeof heading === "string"}
          {heading}
        {:else}
          {@render heading?.()}
        {/if}
      </div>
    </div>
  </summary>
  <div class="content">{@render children?.()}</div>
</details>

<style>
  .ds.accordion-item {
    --dimension-padding-inline-accordion-summary: var(
      --lp-dimension-spacing-inline-m
    );
    --dimension-padding-inline-accordion-content: var(
      --lp-dimension-spacing-inline-m
    );
    --color-background-accordion-summary-hover: var(
      --lp-color-background-hover
    );
    --color-background-accordion-summary-active: var(
      --lp-color-background-active
    );
    --color-border-accordion-item: var(--lp-color-border-default);
    --transition-duration-accordion: var(--lp-transition-duration-fast);
    --transition-timing-accordion: var(--lp-transition-timing-ease-out);

    interpolate-size: allow-keywords;

    &::details-content {
      block-size: 0;
      opacity: 0;
      overflow: clip;
      transition:
        content-visibility var(--transition-duration-accordion)
          var(--transition-timing-accordion),
        opacity var(--transition-duration-accordion)
          var(--transition-timing-accordion),
        block-size var(--transition-duration-accordion)
          var(--transition-timing-accordion);
      transition-behavior: allow-discrete;
    }

    &[open]::details-content {
      block-size: auto;
      opacity: 1;
    }

    &:not(:last-child) {
      border-block-end: var(--lp-dimension-stroke-thickness-default) solid
        var(--color-border-accordion-item);
    }

    summary {
      cursor: pointer;
      transition: background-color var(--transition-duration-accordion)
        var(--transition-timing-accordion);

      list-style: none;
      &::-webkit-details-marker {
        display: none;
      }

      &:hover {
        background-color: var(--color-background-accordion-summary-hover);
      }

      &:active {
        background-color: var(--color-background-accordion-summary-active);
      }
    }

    /*
      Inner wrapper holds the flex layout: applying `display: flex` directly
      to `<summary>` is fragile across browsers (notably WebKit's interaction
      with the disclosure marker layout).
    */
    .summary-content {
      display: flex;
      align-items: center;
      gap: var(--lp-dimension-spacing-inline-xs);
      padding-block: var(--lp-dimension-spacing-block-m);
      padding-inline: var(--dimension-padding-inline-accordion-summary);
    }

    .heading {
      flex: 1;
      min-width: 0;
    }

    :global(.chevron) {
      transition: transform var(--transition-duration-accordion)
        var(--transition-timing-accordion);
    }

    &[open] :global(.chevron) {
      transform: rotate(90deg);
    }

    .content {
      padding-block-end: var(--lp-dimension-spacing-block-l);
      padding-inline: var(--dimension-padding-inline-accordion-content);
    }
  }
</style>
