<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { RadioItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds radio-item contextual-menu-content-item";

  let {
    id,
    class: className,
    style,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    ...rest
  }: RadioItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<label
  {id}
  class={[componentCssClassName, className, { disabled }]}
  {style}
  data-testid="radio-item"
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
  <!-- TODO: Replace with <Radio> -->
  <input type="radio" {disabled} {...rest} />
</label>

<!-- @component
`ContextualMenuContent.RadioItem` renders a radio control.

## Example Usage
```svelte
<ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" checked />
<ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
```
-->

<style>
  .ds.radio-item {
    > input {
      grid-area: checkable;
      margin-inline-end: var(--dimension-margin-end-item-checkable);
    }
  }
</style>
