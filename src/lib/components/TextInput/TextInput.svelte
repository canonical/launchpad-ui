<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { TextInputPrimitive } from "$lib/components/common/index.js";
  import { modifiersValues } from "$lib/modifiers/utils.js";
  import type { TextInputProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds text-input";

  let {
    class: className,
    type = "text",
    modifiers,
    value = $bindable(),
    ...rest
  }: TextInputProps = $props();
</script>

<TextInputPrimitive
  class={[componentCssClassName, className, modifiersValues(modifiers)]}
  {type}
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
