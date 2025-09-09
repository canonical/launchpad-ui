<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { LinkOption } from "$lib/components/common/index.js";
  import { getGroupContext } from "../../context.js";
  import type { LinkItemProps } from "./types.js";

  let { disabled: disabledProp, ...rest }: LinkItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<LinkOption {disabled} {...rest} />

<!-- @component
`ContextualMenuContent.LinkItem` renders an anchor menu item.

## Example Usage
```svelte
<ContextualMenuContent.LinkItem href="/comments" text="See new comments" trailingText="4" />
<ContextualMenuContent.LinkItem href="https://launchpad.net" target="_blank" rel="noopener noreferrer" text="View in Launchpad Classic" />
```
-->
