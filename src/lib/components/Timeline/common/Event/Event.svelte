<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { EventProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds timeline-event";

  let {
    class: className,
    children,
    marker,
    markerSize = "small",
    titleRow,
    ...rest
  }: EventProps = $props();
</script>

<li
  class={[
    componentCssClassName,
    className,
    marker === undefined
      ? "marker-empty"
      : markerSize === "small"
        ? "marker-small"
        : "marker-large",
    { "with-title-row": titleRow },
  ]}
  {...rest}
>
  <div class="marker" aria-hidden="true">
    {#if typeof marker === "function"}
      {@render marker()}
    {:else if marker}
      <UserAvatar {...marker} />
    {/if}
  </div>
  {#if children || titleRow}
    <div class="content">
      {#if titleRow}
        <div class="title-row">
          {@render titleRow?.()}
        </div>
      {/if}
      {#if children}
        <div>
          {@render children()}
        </div>
      {/if}
    </div>
  {/if}
</li>

<!-- @component
`Timeline.Event` is a component that represents a single event on the timeline. It displays a marker that can optionally show an icon or an avatar (both can either be `small` or `large`).

The marker and the first line of the optional `titleRow` are meant to be aligned vertically. This is automatically handled if `<Timeline.Event.TitleRow>` is used. If you wish to provide other content and want this behavior to persist, override `--typography-line-height-timeline-event-title-row` CSS variable with the line height of your content.

## Example Usage
```svelte
<Timeline.Event marker="flag" markerSize="small">
  {#snippet titleRow()}
    <Timeline.Event.TitleRow
      leadingText="Alvarez Daniella"
    >
      did something
      {#snippet date()}
        <DateTime date="2023-03-15" />
      {/snippet}
    </Timeline.Event.TitleRow>
  {/snippet}
  and here is some additional content.
</Timeline.Event>
```
-->
