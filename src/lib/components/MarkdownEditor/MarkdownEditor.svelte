<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { setMarkdownEditorContext } from "./context.js";
  import type { MarkdownEditorProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor";

  let { class: className, children, ...rest }: MarkdownEditorProps = $props();

  let textareaElement = $state<HTMLTextAreaElement>();
  setMarkdownEditorContext({
    get textareaElement() {
      return textareaElement;
    },
    set textareaElement(value) {
      textareaElement = value;
    },
  });
</script>

<div
  class={[componentCssClassName, className]}
  {...rest}
  data-testid="markdown-editor"
>
  {@render children?.()}
</div>

<style>
  .ds.markdown-editor {
    --dimension-gap-markdown-editor: var(--tmp-dimension-spacing-block-xxs);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--dimension-gap-markdown-editor);
  }
</style>
