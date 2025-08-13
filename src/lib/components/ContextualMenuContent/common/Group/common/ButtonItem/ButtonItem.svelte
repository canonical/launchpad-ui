<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { ButtonItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName =
    "ds contextual-menu-content-button-item contextual-menu-content-item";

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
`ContextualMenuContent.ButtonItem` renders a button-style menu action.

## Example Usage
```svelte
<ContextualMenuContent.ButtonItem text="Reset to default" onclick={resetToDefault} />
```
-->

<style>
  .ds.contextual-menu-content-button-item {
    inline-size: 100%;
    border: none;
  }
</style>
