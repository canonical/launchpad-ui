<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { Switch } from "$lib/components/Switch/index.js";
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { SwitchItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds switch-item contextual-menu-content-item";

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
`SwitchItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<SwitchItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</SwitchItem>
```
-->

<style>
  .ds.switch-item {
    > :global(.ds.switch) {
      grid-area: switch;
      margin-inline-start: var(--dimension-margin-start-item-switch);
      opacity: 1;
    }
  }
</style>
