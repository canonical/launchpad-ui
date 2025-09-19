<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { GroupProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-group";

  let { class: className, children, ...rest }: GroupProps = $props();
</script>

<div class={[componentCssClassName, className]} role="group" {...rest}>
  {@render children?.()}
</div>

<style>
  /* .ds.toolbar-group {

  } */
</style>
