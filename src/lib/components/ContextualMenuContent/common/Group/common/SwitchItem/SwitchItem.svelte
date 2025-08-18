<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
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
    group = $bindable(),
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    ...rest
  }: SwitchItemProps<T> = $props();

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
  <!-- In order to forward both group and checked, one of them has to be asserted as undefined, because we disallow using both of them at the same time via props type definition -->
  <Switch bind:checked bind:group={group as undefined} {disabled} {...rest} />
</label>

<!-- @component
`ContextualMenuContent.SwitchItem` renders a switch control.

Component supports group binding. See `Switch` for more details.

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
