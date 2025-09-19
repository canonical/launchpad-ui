<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { createAttachmentKey } from "svelte/attachments";
  import {
    positionAreaFallbackMap,
    useFloatingUI,
  } from "$lib/usePositionArea.svelte.js";
  import type { TooltipProps } from "./types.js";

  const componentCssClassName = "ds tooltip";

  let {
    id: idProp,
    class: className,
    children,
    trigger,
    position = "block-start",
    ...rest
  }: TooltipProps = $props();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const floatingUiPosition = $derived(positionAreaFallbackMap[position]);

  const open = $state(false);

  const { triggerAttachment, targetAttachment } = useFloatingUI(
    () => floatingUiPosition,
    () => open,
  );
</script>

{@render trigger({
  "aria-describedby": id,

  [createAttachmentKey()]: triggerAttachment,
})}

<div
  {id}
  class={[componentCssClassName, className]}
  {@attach targetAttachment}
  {...rest}
>
  {@render children()}
</div>

<!-- @component
`Tooltip` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Tooltip class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Tooltip>
```
-->

<style>
  /* .ds.tooltip {

  } */
</style>
