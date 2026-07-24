<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import type { PartialTextDisclosureProps } from "./types.js";

  let {
    text,
    maxLines: maxLinesProp = 5,
    lineHeightPx,
  }: PartialTextDisclosureProps = $props();

  const paragraphId = $props.id();
  let needsCollapsing = $state(false);
  const maxLines = $derived(Math.max(1, maxLinesProp));

  // We need `transitioning` state to apply `line-clamp` only after the closing transition finishes. Otherwise there would then be no full-height content left for max-height to animate, making the paragraph close immediately.
  let disclosureState = $state<"collapsed" | "expanded" | "transitioning">(
    "collapsed",
  );
  const isExpanded = $derived(disclosureState === "expanded");
  const ontransitionend = (event: TransitionEvent) => {
    if (
      event.propertyName === "max-height" &&
      event.target === event.currentTarget &&
      disclosureState === "transitioning"
    ) {
      disclosureState = "collapsed";
    }
  };

  const toggle = () => {
    if (!isExpanded) {
      disclosureState = "expanded";
      return;
    }

    // Unsupported browsers do not transition intrinsic sizes or emit transitionend.
    disclosureState = CSS.supports("interpolate-size: allow-keywords")
      ? "transitioning"
      : "collapsed";
  };

  const observeOverflow: Attachment<HTMLParagraphElement> = (paragraph) => {
    let didWarnAboutLineHeight = false;

    const testOverflow = () => {
      const lineHeight =
        lineHeightPx ??
        Number.parseFloat(getComputedStyle(paragraph).lineHeight);

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

      needsCollapsing = paragraph.scrollHeight > maxLines * lineHeight;
    };
    // Observe for width changes
    const resizeObserver = new ResizeObserver(testOverflow);
    resizeObserver.observe(paragraph);
    // Observe for content, maxLines, lineHeightPx changes without recreating the ResizeObserver
    $effect(() => {
      void text;
      testOverflow();
    });

    return () => resizeObserver.disconnect();
  };
</script>

<p
  {@attach observeOverflow}
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

      &:is([data-state="collapsed"], [data-state="transitioning"]) {
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
