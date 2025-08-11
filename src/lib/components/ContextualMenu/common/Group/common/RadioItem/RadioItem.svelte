<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { ItemContent } from "../common/index.js";
  import type { RadioItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds radio-item contextual-menu-item";

  let {
    id,
    class: className,
    style,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled,
    ...rest
  }: RadioItemProps = $props();
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
`RadioItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<RadioItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</RadioItem>
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
