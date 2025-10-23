<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { TextInputPrimitive } from "$lib/components/common/index.js";
  import { modifiersValues } from "$lib/modifiers/utils.js";
  import type { TextInputProps } from "./types.js";

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

<style>
  :global(.ds.text-input) {
    --color-background-text-input-active: var(
      --tmp-color-background-secondary-active-context,
      var(--tmp-color-background-active)
    );
    --color-background-text-input-hover: var(
      --tmp-color-background-secondary-hover-context,
      var(--tmp-color-background-hover)
    );
    --color-background-text-input: var(
      --tmp-color-background-secondary-context,
      var(--tmp-color-background-input)
    );
    --dimension-padding-block-text-input: var(
      --dimension-padding-block-context,
      var(--tmp-dimension-spacing-block-xxs)
    );
    --color-border-text-input: var(
      --tmp-color-border-secondary-context,
      var(--tmp-color-border-high-contrast)
    );
    --color-outline-text-input: var(
      --tmp-color-border-secondary-context,
      var(--tmp-color-border-focus)
    );
  }
</style>
