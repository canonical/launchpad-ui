<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Link } from "@canonical/svelte-ds-app-launchpad";
  import type { LinkProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds timeline-hidden-events-link";

  let { class: className, ...rest }: LinkProps = $props();
</script>

<!-- A separate element instead of a pseudo-element on the link, so it doesn't get underlined on hover -->
<span class="{componentCssClassName}-separator" aria-hidden="true">•</span>
<Link class={[componentCssClassName, className]} {...rest} />

<!-- @component
`Timeline.HiddenEvents.Link` wraps the `Link` for use inside `Timeline.HiddenEvents`.

## Example Usage
```svelte
<Timeline.HiddenEvents numHidden={3}>
  <Timeline.HiddenEvents.Link href="?showAll">Show all</Timeline.HiddenEvents.Link>
</Timeline.HiddenEvents>
```
-->
