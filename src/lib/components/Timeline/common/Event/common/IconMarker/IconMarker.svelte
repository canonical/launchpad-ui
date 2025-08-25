<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import type { IconMarkerProps } from "./types.js";

  const componentCssClassName = "ds icon-marker";

  let {
    class: className,
    name,
    modifiers,
    ...rest
  }: IconMarkerProps = $props();
</script>

<div class={[componentCssClassName, modifiers, className]} {...rest}>
  <Icon {name} />
</div>

<!-- @component
`IconMarker` allows for marking a timeline event with an icon.

## Example Usage
```svelte
<Timeline.IconMarker name="flag" modifiers={['small']} />
```
-->

<style>
  .ds.icon-marker {
    --color-background-timeline-icon-marker: var(
      --color-background-timeline-marker,
      var(--tmp-color-background-alt)
    );
    --border-timeline-icon-marker: var(
      --border-timeline-marker,
      var(--dimension-stroke-thickness-default) solid
        var(--tmp-color-border-default)
    );
    --dimension-size-timeline-icon-marker: var(
      --dimension-size-context,
      var(--tmp-dimension-size-m)
    );

    display: inline-grid;
    place-content: center;

    width: var(--dimension-size-timeline-icon-marker);
    height: var(--dimension-size-timeline-icon-marker);
    border: var(--border-timeline-icon-marker);
    background-color: var(--color-background-timeline-icon-marker);
  }
</style>
