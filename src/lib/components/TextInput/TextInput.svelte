<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { InputPrimitive } from "$lib/components/common/index.js";
  import type { TextInputProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds text-input";

  let {
    class: className,
    severity,
    density,
    value = $bindable(),
    ...rest
  }: TextInputProps = $props();
</script>

<InputPrimitive
  class={[componentCssClassName, className, severity, density]}
  bind:value
  {...rest}
/>

<!-- @component
`TextInput` is a styled wrapper around the native text-based `<input>` element.

As an input, it requires a `<label>` associated with it.

## Example Usage
```svelte
<label>
  Password
  <TextInput type="password" placeholder="*********" minLength={8} required />
</label>
```
-->
