<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import type { ButtonItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds navigation-button-item navigation-item";

  let {
    class: className,
    children,
    icon,
    selected,
    ...rest
  }: ButtonItemProps = $props();
</script>

<ButtonPrimitive
  as="button"
  class={[componentCssClassName, className, { selected }]}
  {...rest}
>
  {@render icon?.()}
  {@render children?.()}
</ButtonPrimitive>

<!-- @component
`ButtonItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ButtonItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ButtonItem>
```
-->
