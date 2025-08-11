<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { LinkItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds link-item contextual-menu-item";

  let {
    class: className,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    href,
    ...rest
  }: LinkItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<a
  class={[componentCssClassName, className, { disabled }]}
  href={disabled ? undefined : href}
  role={disabled ? "link" : undefined}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  {...rest}
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
</a>

<!-- @component
`LinkItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<LinkItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</LinkItem>
```
-->

<style>
  .ds.link-item {
    text-decoration: none;
  }
</style>
