<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { SwitchOption } from "$lib/components/common/index.js";
  import { getGroupContext } from "../../context.js";
  import type { SwitchItemProps } from "./types.js";

  let {
    checked = $bindable(),
    group = $bindable(),
    disabled: disabledProp,
    ...rest
  }: SwitchItemProps<T> = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<SwitchOption
  bind:checked
  bind:group={group as undefined}
  {disabled}
  {...rest}
/>

<!-- @component
`ContextualMenuContent.SwitchItem` renders a switch control.

Component supports group binding. See `Switch` for more details.

## Example Usage
```svelte
<ContextualMenuContent.SwitchItem text="Auto-save changes" bind:checked={autoSave} />
```
-->
