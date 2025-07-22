<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { TabProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds tab";

  let {
    id,
    class: className,
    children,
    style,
    active,
    ...rest
  }: TabProps = $props();
</script>

<li class={[componentCssClassName, className, { active }]} {id} {style}>
  <a aria-current={active ? "page" : undefined} {...rest}>
    {@render children?.()}
  </a>
</li>
