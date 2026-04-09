<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import "./styles.css";
  import type { HiddenEventsProps } from "./types.js";

  const componentCssClassName = "ds timeline-hidden-events";

  let {
    class: className,
    children,
    numHidden,
    ...rest
  }: HiddenEventsProps = $props();
</script>

<li class={[componentCssClassName, className]} {...rest}>
  <div>
    <span>
      {numHidden} hidden
    </span>
    {@render children?.()}
  </div>
</li>

<!-- @component
`HiddenEvents` component provides a way to inform the user, that not all events are visible in the timeline. It displays a message indicating the number of events hidden from the view and optionally allows the user to display more or all the hidden events.

## Example Usage
```svelte
<Timeline.HiddenEvents numHidden={888}>
  <Timeline.HiddenEvents.Link href="?showAll">Show all</Timeline.HiddenEvents.Link>
</Timeline.HiddenEvents>
```
-->
