<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { InputPrimitive } from "$lib/components/common/index.js";
  import type { TextInputProps } from "./types.js";

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

<style>
  :global(.ds.text-input) {
    --color-background-text-input-active: var(
      --lp-color-background-secondary-active-context,
      var(--lp-color-background-active)
    );
    --color-background-text-input-hover: var(
      --lp-color-background-secondary-hover-context,
      var(--lp-color-background-hover)
    );
    --color-background-text-input: var(
      --lp-color-background-secondary-context,
      var(--lp-color-background-input)
    );
    --dimension-padding-block-text-input: var(
      --dimension-padding-block-context,
      var(--lp-dimension-spacing-block-xxs)
    );
    --color-border-text-input: var(
      --lp-color-border-secondary-context,
      var(--lp-color-border-high-contrast)
    );
    --color-outline-text-input: var(
      --lp-color-border-secondary-context,
      var(--lp-color-border-focus)
    );
  }
</style>
