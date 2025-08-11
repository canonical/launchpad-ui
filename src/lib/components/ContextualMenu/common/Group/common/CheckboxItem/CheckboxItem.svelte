<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { CheckboxItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds checkbox-item contextual-menu-item";

  let {
    id,
    class: className,
    style,
    checked = $bindable(),
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    ...rest
  }: CheckboxItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<label
  {id}
  class={[componentCssClassName, className, { disabled }]}
  {style}
  data-testid="checkbox-item"
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
  <!-- TODO: Replace with <Checkbox> -->
  <input type="checkbox" bind:checked {disabled} {...rest} />
</label>

<!-- @component
`CheckboxItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<CheckboxItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</CheckboxItem>
```
-->

<style>
  .ds.checkbox-item {
    > input {
      grid-area: checkable;
      margin-inline-end: var(--dimension-margin-end-item-checkable);
    }
  }
</style>
