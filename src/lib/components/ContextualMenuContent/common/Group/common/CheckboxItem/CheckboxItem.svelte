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
`Combobox.RadioOption` represents a selectable option within a `Combobox` with `type="single-select"`.

## Example Usage
```svelte
<Combobox.RadioOption text="Option 1" checked />
<Combobox.RadioOption text="Option 2" secondaryText="Additional info" onchange={handleChange} />
<Combobox.RadioOption text="Option 3" >
  {#snippet icon()}
    <Check />
  {/snippet}
</Combobox.RadioOption>
```
-->
