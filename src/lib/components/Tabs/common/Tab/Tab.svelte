<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { TabProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds tab";

  let { class: className, children, active, ...rest }: TabProps = $props();
</script>

<a class={[componentCssClassName, className, { active }]} {...rest}>
  {@render children?.()}
</a>
