<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type {
    BlockPosition,
    InlinePosition,
    PopoverMethods,
    PopoverProps,
  } from "./types.js";

  const componentCssClassName = "ds popover";

  let {
    id: idProp,
    class: className,
    children,
    trigger,
    ontoggle: ontoggleProp,
    popover = "auto",
    position = "block-end span-inline-end",
    ...rest
  }: PopoverProps = $props();

  let open = $state(false);
  let popoverRef = $state<HTMLDivElement>();

  const ontoggle: typeof ontoggleProp = (e) => {
    ontoggleProp?.(e);
    open = e.newState === "open";
  };

  export const showPopover: PopoverMethods["showPopover"] = () => {
    popoverRef?.showPopover();
  };

  export const hidePopover: PopoverMethods["hidePopover"] = () => {
    popoverRef?.hidePopover();
  };

  export const togglePopover: PopoverMethods["togglePopover"] = () => {
    popoverRef?.togglePopover();
  };

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  // TODO(position-area): Remove these when `position-area` has acceptable support
  let wrapperHeight = $state<number>();
  let wrapperWidth = $state<number>();
  let popoverHeight = $state<number>();
  let popoverWidth = $state<number>();
  $effect(() => {
    if (
      CSS.supports("position-area", position) ||
      wrapperHeight === undefined ||
      wrapperWidth === undefined ||
      popoverHeight === undefined ||
      popoverWidth === undefined ||
      !popoverRef
    )
      return;

    const [blockPosition, inlinePosition] = position.split(" ") as [
      BlockPosition,
      InlinePosition,
    ];

    let translateY = 0;
    let translateX = 0;

    if (blockPosition === "block-start") {
      translateY = -(wrapperHeight + popoverHeight);
    }

    if (inlinePosition === "span-inline-start") {
      translateX = wrapperWidth - popoverWidth;
    } else if (inlinePosition === "span-all") {
      translateX = (wrapperWidth - popoverWidth) / 2;
    }

    popoverRef.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });
</script>

<!-- TODO(position-area): Remove this wrapper when `position-area` has acceptable support -->
<div
  bind:clientHeight={wrapperHeight}
  bind:clientWidth={wrapperWidth}
  class="{componentCssClassName}-wrapper"
>
  {@render trigger(id, open)}
  <div
    bind:this={popoverRef}
    bind:offsetHeight={popoverHeight}
    bind:offsetWidth={popoverWidth}
    {id}
    class={[componentCssClassName, className]}
    {popover}
    {ontoggle}
    data-testid="popover"
    style:--position-area-popover={position}
    {...rest}
  >
    {@render children?.(id)}
  </div>
</div>

<!-- @component
`Popover` provides a mechanism for displaying popover content on top of other page content. It is a bring-your-own trigger and content component.

The content is by default displayed on the block-end side of the trigger, aligned to its inline-start and spanning towards its inline-end. If the content were to overflow the viewport and the browser supports position-fallbacks, other positioning strategies will be tried.

To control the popover declaratively, pass the `popovertarget` supplied via the `trigger` snippet to your trigger button.

If needed, you may control the popover imperatively by calling `showPopover`, `hidePopover` or `togglePopover` exposed on the component instance.

## Example Usage
```svelte
<script lang="ts">
  let popover = $state<PopoverMethods>();
  // Optional imperative control
  $effect(() => popover?.showPopover())
</script>

<Popover bind:this={popover}>
  {#snippet trigger(popovertarget, open)}
    <button {popovertarget}>
      {open ? "Close Popover" : "Open Popover"}
    </button>
  {/snippet}
  This is content of the popover.
</Popover>
```
-->

<style>
  .ds.popover {
    /* TODO(position-area): Uncomment when `position-area` has acceptable support */
    /* --position-area-popover: block-end span-inline-start; */
    --position-try-fallbacks-popover: flip-inline;

    border: 0;
    inset: auto;
    position: relative;

    position-area: var(--position-area-popover);
    position-try-fallbacks: var(--position-try-fallbacks-popover);
  }

  .wrapper {
    display: inline-block;
  }
</style>
