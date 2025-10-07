<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import type { LinkItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName = "ds navigation-link-item navigation-item";

  let {
    class: className,
    children,
    icon,
    selected,
    ...rest
  }: LinkItemProps = $props();

  const labelId = $props.id();
</script>

<ButtonPrimitive
  as="a"
  class={[componentCssClassName, className, { selected }]}
  aria-labelledby={labelId}
  {...rest}
>
  {@render icon?.()}
  <!-- using labeled-by exposes the contents to a11y tree even if the label is visually hidden -->
  <div id={labelId} class="label">
    {@render children()}
  </div>
</ButtonPrimitive>

<!-- @component
`LinkItem` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<LinkItem class="custom-class" id="unique-id">
  <p>Content goes here</p>
</LinkItem>
```
-->
