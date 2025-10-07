<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Textarea } from "$lib/components/index.js";
  import { useShortcutsManager } from "$lib/shortcut/useShortcutsManager.svelte.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import "./styles.css";
  import type { TextareaProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-textarea";

  let {
    class: className,
    value = $bindable(),
    ref = $bindable(),
    ...rest
  }: TextareaProps = $props();
  const markdownEditorContext = getMarkdownEditorContext();

  const shortcutsManager = $derived(markdownEditorContext?.shortcutsManager);
  const { targetAttachment } = $derived(
    shortcutsManager
      ? useShortcutsManager(() => shortcutsManager)
      : { targetAttachment: () => {} },
  );

  $effect(() => {
    if (markdownEditorContext) {
      markdownEditorContext.textareaElement = ref;
    }

    return () => {
      if (markdownEditorContext) {
        markdownEditorContext.textareaElement = undefined;
      }
    };
  });
</script>

<Textarea
  bind:ref
  class={[componentCssClassName, className]}
  bind:value
  {@attach targetAttachment}
  {...rest}
/>
