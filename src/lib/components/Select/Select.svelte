<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ChevronDownIcon } from "@canonical/svelte-icons";
  import type { SelectProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds select";

  let {
    class: className,
    ref = $bindable(),
    value = $bindable(),
    children,
    severity,
    density,
    "data-testid": dataTestId,
    ...rest
  }: SelectProps = $props();
</script>

<div
  class={[componentCssClassName, className, severity, density]}
  data-testid={dataTestId}
>
  <select bind:value bind:this={ref} {...rest}>
    {@render children?.()}
  </select>
  {#if !rest.multiple}
    <ChevronDownIcon class="chevron" />
  {/if}
</div>

<!-- @component
`Select` a native `<select>` element with styles.

## Example Usage
```svelte
<Select bind:value={valueState}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Select>
```
-->
