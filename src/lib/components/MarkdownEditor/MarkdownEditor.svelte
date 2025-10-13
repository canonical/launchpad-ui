<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ShortcutsProvider } from "$lib/shortcuts/ShortcutsProvider/index.js";
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

<ShortcutsProvider>
  <div
    class={[componentCssClassName, className]}
    data-testid="markdown-editor"
    {...rest}
  >
    {@render children?.()}
  </div>
</ShortcutsProvider>

<style>
  .ds.markdown-editor {
    --dimension-gap-markdown-editor: var(--tmp-dimension-spacing-block-minimum);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--dimension-gap-markdown-editor);
  }
</style>
