<script lang="ts">
  import type { PartialTextDisclosureProps } from "./types.js";
  import { browser } from "$app/environment";

  let {
    text,
    maxLines: maxLinesProp = 5,
    lineHeightPx,
  }: PartialTextDisclosureProps = $props();

  const paragraphId = $props.id();
  let paragraphRef = $state<HTMLParagraphElement>();
  let needsCollapsing = $state(false);
  const maxLines = $derived(Math.max(1, maxLinesProp));

  const supportsInterpolateSize =
    browser && CSS.supports("interpolate-size: allow-keywords");
  // We need `collapsing` state to apply `line-clamp` only after the closing transition finishes. Otherwise there would then be no full-height content left for max-height to animate, making the paragraph close immediately.
  // `expanding` is an optimization to avoid repeated ResizeObserver's `testOverflow` calls
  let disclosureState = $state<
    "collapsed" | "expanded" | "collapsing" | "expanding"
  >("collapsed");
  const ontransitionend = (event: TransitionEvent) => {
    if (
      event.propertyName !== "max-height" ||
      event.target !== event.currentTarget ||
      !isTransitioning
    )
      return;

    disclosureState =
      disclosureState === "collapsing" ? "collapsed" : "expanded";

    // We skip the RO-triggered tests while transitioning, so test now, after we settled.
    testOverflow();
  };

  // Copy and aria should update immediately after toggle, not after the transition ends
  const isExpanded = $derived(
    disclosureState === "expanded" || disclosureState === "expanding",
  );
  const isTransitioning = $derived(
    disclosureState === "expanding" || disclosureState === "collapsing",
  );

  function toggle() {
    // Unsupported browsers do not transition intrinsic sizes or emit transitionend.
    if (isExpanded) {
      disclosureState = supportsInterpolateSize ? "collapsing" : "collapsed";
      return;
    }

    disclosureState = supportsInterpolateSize ? "expanding" : "expanded";
  }

  let didWarnAboutLineHeight = false;
  function testOverflow() {
    if (!paragraphRef) return;

    const lineHeight =
      lineHeightPx ??
      Number.parseFloat(getComputedStyle(paragraphRef).lineHeight);

    if (Number.isNaN(lineHeight)) {
      if (!didWarnAboutLineHeight) {
        console.warn(
          "Unable to automatically determine the line height of the paragraph. Set the `lineHeightPx` prop to enable accurate overflow detection.",
        );
        didWarnAboutLineHeight = true;
      }

      needsCollapsing = true;
      return;
    }

    needsCollapsing = paragraphRef.scrollHeight > maxLines * lineHeight;
  }

  // Observe for width changes
  $effect(() => {
    if (!paragraphRef) return;
    const resizeObserver = new ResizeObserver(() => {
      if (isTransitioning) return;
      testOverflow();
    });
    resizeObserver.observe(paragraphRef);

    return () => resizeObserver.disconnect();
  });

  // Observe for text + anything testOverflow depends on
  $effect(() => {
    void text;
    testOverflow();
  });
</script>

<p
  bind:this={paragraphRef}
  id={paragraphId}
  data-state={disclosureState}
  style:--max-lines={maxLines}
  style:line-height={lineHeightPx !== undefined
    ? `${lineHeightPx}px`
    : undefined}
  {ontransitionend}
>
  {text}
</p>
{#if needsCollapsing}
  <button
    aria-controls={paragraphId}
    aria-expanded={isExpanded}
    onclick={toggle}
    aria-label={isExpanded ? "Collapse visual text" : "Expand visual text"}
  >
    {isExpanded ? "Show less" : "Show more"}
  </button>
{/if}

<!-- @component
`PartialTextDisclosure` renders text collapsed to a fixed number of lines
(`maxLines`) with a "Show more"/"Show less" toggle when the text overflows.

The full text is always present in the DOM; collapsing is purely visual and
only applied when JavaScript is available.

## Example Usage
```svelte
<PartialTextDisclosure text={longDescription} maxLines={3} />
```
-->

<style>
  p {
    margin-block: var(--lp-dimension-spacing-block-xs);
    white-space: pre-wrap;
    padding-block: 0;

    /* Only collapse if we have JS to control it */
    @media (scripting: enabled) {
      overflow: hidden;
      max-height: max-content;
      interpolate-size: allow-keywords;
      transition: max-height var(--lp-transition-duration-fast)
        var(--lp-transition-timing-ease-out);

      &:is([data-state="collapsed"], [data-state="collapsing"]) {
        max-height: calc(var(--max-lines) * 1lh);
      }

      &[data-state="collapsed"] {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--max-lines);
        line-clamp: var(--max-lines);
      }
    }
  }

  button {
    /* TODO: Link-looking-like button */
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    outline-offset: 0px;
    text-decoration: underline;
    color: var(--lp-color-text-default);
  }
</style>
