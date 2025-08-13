<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { Switch } from "$lib/components/Switch/index.js";
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { SwitchItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName =
    "ds contextual-menu-content-switch-item contextual-menu-content-item";

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
  }: SwitchItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<label
  {id}
  class={[componentCssClassName, className, { disabled }]}
  {style}
  data-testid="switch-item"
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
  <Switch bind:checked {disabled} {...rest} />
</label>

<!-- @component
`ContextualMenuContent.SwitchItem` renders a switch control.

## Example Usage
```svelte
<ContextualMenuContent.SwitchItem text="Auto-save changes" bind:checked={autoSave} />
```
-->

<style>
  .ds.contextual-menu-content-switch-item {
    > :global(.ds.switch) {
      grid-area: switch;
      margin-inline-start: var(
        --dimension-margin-start-contextual-menu-content-item-switch
      );
      opacity: 1;
    }
  }
</style>
