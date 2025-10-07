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

  const labelId = $props.id();
</script>

<ButtonPrimitive
  as="button"
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
