<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { createAttachmentKey } from "svelte/attachments";
  import { usePositionArea } from "$lib/usePositionArea.svelte.js";
  import type { PopoverMethods, PopoverProps } from "./types.js";

  const componentCssClassName = "ds popover";

  let {
    id: idProp,
    class: className,
    style,
    children,
    trigger,
    ontoggle: ontoggleProp,
    popover = "auto",
    position = "block-end span-inline-end",
    positionTryFallback,
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

  const { triggerAttachment, targetAttachment, targetStyle } = usePositionArea(
    () => position,
    () => open,
    () => positionTryFallback,
  );
</script>

{@render trigger(
  { popovertarget: id, [createAttachmentKey()]: triggerAttachment },
  open,
)}
<div
  bind:this={popoverRef}
  {id}
  class={[componentCssClassName, className]}
  {popover}
  {ontoggle}
  data-testid="popover"
  style="{targetStyle()} {style}"
  {@attach targetAttachment}
  {...rest}
>
  {@render children?.(id)}
</div>

<!-- @component
`Popover` provides a mechanism for displaying popover content on top of other page content. It is a bring-your-own trigger and content component.

The content is by default displayed on the block-end side of the trigger, aligned to its inline-start and spanning towards its inline-end. If the content were to overflow the viewport and the browser supports position-fallbacks, other positioning strategies will be tried.

To control the popover declaratively (and provide JS-based positioning fallback for unsupported browsers), spread `triggerProps` supplied via the `trigger` onto your trigger button.

If needed, you may control the popover imperatively by calling `showPopover`, `hidePopover` or `togglePopover` exposed on the component instance.

## Example Usage
```svelte
<script lang="ts">
  let popover = $state<PopoverMethods>();
  // Optional imperative control
  $effect(() => popover?.showPopover())
</script>

<Popover bind:this={popover}>
  {#snippet trigger(triggerProps, open)}
    <button {...triggerProps}>
      {open ? "Close Popover" : "Open Popover"}
    </button>
  {/snippet}
  This is content of the popover.
</Popover>
```
-->

<style>
  .ds.popover {
    border: 0;
    inset: auto;
  }
</style>
