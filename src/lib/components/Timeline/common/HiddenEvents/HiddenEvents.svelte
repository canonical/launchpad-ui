<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Link } from "@canonical/svelte-ds-app-launchpad";
  import "./styles.css";
  import type { HiddenEventsProps } from "./types.js";

  const componentCssClassName = "ds timeline-hidden-events";

  let {
    class: className,
    numHidden,
    showMoreHref,
    showAllHref,
    ...rest
  }: HiddenEventsProps = $props();
</script>

<li class={[componentCssClassName, className]} {...rest}>
  <div>
    <span>
      {numHidden} hidden
    </span>
    {#if showMoreHref}
      <span class="link-separator" aria-hidden="true"></span>
      <Link href={showMoreHref} class="show-link">Show more</Link>
    {/if}
    {#if showAllHref}
      <span class="link-separator" aria-hidden="true"></span>
      <Link href={showAllHref} class="show-link">Show all</Link>
    {/if}
  </div>
</li>

<!-- @component
`HiddenEvents` component provides a way to inform the user, that not all events are visible in the timeline. It displays a message indicating the number of events hidden from the view and optionally allows the user to display more or all the hidden events.

## Example Usage
```svelte
<Timeline.HiddenEvents numHidden={888} showMoreHref="?showMore" showAllHref="?showAll" />
```
-->
