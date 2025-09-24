<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { MarkdownEditorHeaderProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-header";

  let {
    class: className,
    children,
    ...rest
  }: MarkdownEditorHeaderProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</div>

<style>
  .ds.markdown-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
