<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { MarkdownEditorControlsProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-controls";

  let {
    class: className,
    children,
    ...rest
  }: MarkdownEditorControlsProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {@render children?.()}
</div>
