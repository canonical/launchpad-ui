<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Shortcut, ShortcutsManager } from "$lib/shortcut/index.js";
  import { DEFAULT_SHORTCUTS, HelpModal } from "./common/index.js";
  import { setMarkdownEditorContext } from "./context.js";
  import type { MarkdownEditorProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor";

  let { class: className, children, ...rest }: MarkdownEditorProps = $props();

  let textareaElement = $state<HTMLTextAreaElement>();
  let shortcuts = $state<Shortcut<HTMLTextAreaElement>[]>([
    ...Object.values(DEFAULT_SHORTCUTS),
  ]);
  let shortcutsManager = $derived(new ShortcutsManager(shortcuts));

  setMarkdownEditorContext({
    get textareaElement() {
      return textareaElement;
    },
    set textareaElement(value) {
      textareaElement = value;
    },

    get shortcuts() {
      return shortcuts;
    },
    set shortcuts(value) {
      shortcuts = value;
    },

    get shortcutsManager() {
      return shortcutsManager;
    },
  });
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="markdown-editor"
  {...rest}
>
  {@render children?.()}
  <HelpModal />
</div>

<style>
  .ds.markdown-editor {
    --dimension-gap-markdown-editor: var(--tmp-dimension-spacing-block-xxs);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--dimension-gap-markdown-editor);
  }
</style>
