<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ShortcutsHelpModal } from "$lib/components/ShortcutsHelpModal/index.js";
  import type { ShortcutsHelpModalMethods } from "$lib/components/ShortcutsHelpModal/index.js";
  import {
    ShortcutsProvider,
    UseShortcuts,
  } from "$lib/shortcuts/ShortcutsProvider/index.js";
  import { Shortcut } from "$lib/shortcuts/index.js";
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

  let modalMethods = $state<ShortcutsHelpModalMethods>();

  const helpShortcut = new Shortcut(
    "ctrl+/",
    {
      label: "Open command guide",
    },
    () => {
      modalMethods?.show();
    },
  );
</script>

<ShortcutsProvider>
  <UseShortcuts shortcuts={helpShortcut} />
  <ShortcutsHelpModal bind:this={modalMethods} />
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
    --dimension-gap-markdown-editor: var(--tmp-dimension-spacing-block-xxs);
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--dimension-gap-markdown-editor);
  }
</style>
