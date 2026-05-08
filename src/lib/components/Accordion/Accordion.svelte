<script module lang="ts">
  import {
    getFirstElement,
    getLastElement,
    getSiblingElement,
  } from "$lib/utils/index.js";

  const SUMMARY_SELECTOR = ".ds.accordion-item > summary";

  type NavParams = {
    containerElement: HTMLElement;
    currentElement: HTMLElement;
  };

  const KEY_HANDLERS: Record<string, (p: NavParams) => HTMLElement | null> = {
    ArrowDown: ({ containerElement, currentElement }) =>
      getSiblingElement({
        containerElement,
        currentElement,
        selector: SUMMARY_SELECTOR,
        direction: "next",
        wrap: true,
      }),
    ArrowUp: ({ containerElement, currentElement }) =>
      getSiblingElement({
        containerElement,
        currentElement,
        selector: SUMMARY_SELECTOR,
        direction: "previous",
        wrap: true,
      }),
    Home: ({ containerElement }) =>
      getFirstElement({ containerElement, selector: SUMMARY_SELECTOR }),
    End: ({ containerElement }) =>
      getLastElement({ containerElement, selector: SUMMARY_SELECTOR }),
  };

  const getNextFocusTarget = (event: KeyboardEvent, params: NavParams) =>
    KEY_HANDLERS[event.key]?.(params);
</script>

<script lang="ts">
  import { setAccordionContext } from "./context.js";
  import type { AccordionProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds accordion";

  let {
    class: className,
    exclusive = false,
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: AccordionProps = $props();

  const groupName = $props.id();
  let rootRef = $state<HTMLDivElement>();

  setAccordionContext({
    get name() {
      return exclusive ? groupName : undefined;
    },
  });

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (!rootRef) return;

    const target = event.target;
    if (!(target instanceof HTMLElement) || target.tagName !== "SUMMARY") {
      return;
    }

    const next = getNextFocusTarget(event, {
      containerElement: rootRef,
      currentElement: target,
    });

    if (!next || next === target) return;

    event.preventDefault();
    next.focus();
  };
</script>

<div
  bind:this={rootRef}
  class={[componentCssClassName, className]}
  {onkeydown}
  {...rest}
>
  {@render children?.()}
</div>

<!-- @component
`Accordion` is a container for a vertically stacked list of collapsible
sections, each rendered as a native `<details>` element.

Set `exclusive` to allow only one section to be open at a time. This uses
the native `<details name>` attribute, so no JavaScript is required to
enforce the invariant.

Implements the [WAI-ARIA Accordion
Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) keyboard
navigation between item headers:
- `ArrowDown`/`ArrowUp`: move focus to next/previous header (wraps)
- `Home`/`End`: move focus to the first/last header
- `Enter`/`Space`: toggle the focused item (native `<summary>` behavior)

## Example Usage
```svelte
<Accordion exclusive>
  <Accordion.Item heading="Section 1">
    Body content
  </Accordion.Item>
  <Accordion.Item open heading="Section 2">
    Body content
  </Accordion.Item>
</Accordion>
```

The `heading` prop also accepts a snippet for richer markup; see
`Accordion.Item` for details.
-->
