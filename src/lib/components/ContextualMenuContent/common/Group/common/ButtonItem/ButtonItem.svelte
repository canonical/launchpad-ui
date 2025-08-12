<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { ButtonItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds button-item contextual-menu-content-item";

  let {
    class: className,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    // Override default button type, so that if used inside the form it doesn't submit it by default
    type = "button",
    ...rest
  }: ButtonItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<button
  class={[componentCssClassName, className, { disabled }]}
  {disabled}
  {type}
  {...rest}
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
</button>

<!-- @component
`ButtonItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ButtonItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ButtonItem>
```
-->

<style>
  .ds.button-item {
    inline-size: 100%;
    border: none;
  }
</style>
