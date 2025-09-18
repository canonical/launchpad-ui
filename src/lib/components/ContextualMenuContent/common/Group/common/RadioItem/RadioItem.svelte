<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { RadioOption } from "$lib/components/common/index.js";
  import { getGroupContext } from "../../context.js";
  import type { RadioItemProps } from "./types.js";

  let {
    group = $bindable(),
    disabled: disabledProp,
    ...rest
  }: RadioItemProps<T> = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<RadioOption bind:group={group as undefined} {disabled} {...rest} />

<!-- @component
`ContextualMenuContent.RadioItem` renders a radio control.

Component supports group binding. See `Radio` for more details.

## Example Usage
```svelte
<ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" checked />
<ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
```
-->
