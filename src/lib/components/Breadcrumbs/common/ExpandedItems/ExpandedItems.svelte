<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { Item } from "../common/index.js";
  import type { ExpandedItemsProps } from "./types.js";

  const componentCssClassName = "ds expanded-items";

  let {
    segments,
    segmentWidths = $bindable(),
    containerWidth = $bindable(),
    canCollapseMore,
  }: ExpandedItemsProps = $props();

  const isMounted = useIsMounted();
  const wrapExpanded = $derived(
    // Allow wrapping of the expanded segments if JavaScript is not available (we never mount) or we have already collapsed all there is to collapse
    !isMounted.value || !canCollapseMore,
  );
</script>

<li
  role="none"
  class={componentCssClassName}
  style:white-space={wrapExpanded ? "normal" : "nowrap"}
  bind:clientWidth={containerWidth}
>
  <ol role="none">
    {#each segments as segment, i (i)}
      <li
        role="listitem"
        bind:offsetWidth={segmentWidths[i]}
        class:hidden={segment.hidden}
        aria-hidden={segment.hidden}
      >
        <Item {segment} current={i === segments.length - 1} />
      </li>
    {/each}
  </ol>
</li>

<style>
  .ds.expanded-items {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;

    ol,
    li {
      display: inline-block;
      max-width: 100%;
    }

    li {
      white-space: nowrap;

      &:not(.hidden) {
        overflow: hidden;
        text-overflow: ellipsis;

        + li::before {
          /* Show separator before all the segments that follow a non-hidden segment. This is in practice applies only when there is no collapse section */
          content: "/" / "";
          margin-inline: var(--dimension-margin-inline-breadcrumbs-separator);
        }
      }

      &.hidden {
        visibility: hidden;
        position: absolute;
        pointer-events: none;
      }
    }
  }
</style>
