<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { CheckboxOption } from "$lib/components/common/index.js";
  import { getGroupContext } from "../../context.js";
  import type { CheckboxItemProps } from "./types.js";

  let {
    checked = $bindable(),
    group = $bindable(),
    disabled: disabledProp,
    ...rest
  }: CheckboxItemProps<T> = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<CheckboxOption
  bind:checked
  bind:group={group as undefined}
  {disabled}
  {...rest}
/>

<!-- @component
`ContextualMenuContent.CheckboxItem` renders a checkbox control.

Component supports group binding. See `Checkbox` for more details.

## Example Usage
```svelte
<ContextualMenuContent.CheckboxItem text="Show whitespace changes" bind:checked={showWhitespace} />
```
-->
