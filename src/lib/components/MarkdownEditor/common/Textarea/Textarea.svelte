<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Textarea } from "$lib/components/Textarea/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import type { TextareaProps } from "./types.js";
  import { applyAutoCompletions } from "./utils/index.js";

  const componentCssClassName = "ds markdown-editor-textarea";

  let {
    class: className,
    value = $bindable(),
    ref = $bindable(),
    onkeydown: onkeydownProp,
    disableAutoCompletions = false,
    id: idProp,
    ...rest
  }: TextareaProps = $props();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);
  const markdownEditorContext = getMarkdownEditorContext();

  $effect(() => {
    if (markdownEditorContext) {
      markdownEditorContext.textareaElement = ref;
      markdownEditorContext.textareaId = id;
    }

    return () => {
      if (markdownEditorContext) {
        markdownEditorContext.textareaElement = undefined;
        markdownEditorContext.textareaId = undefined;
      }
    };
  });

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (!ref || disableAutoCompletions) return;
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      if (applyAutoCompletions(ref)) {
        event.preventDefault();
      }
    }
  };
</script>

<Textarea
  bind:ref
  class={[componentCssClassName, className]}
  bind:value
  {onkeydown}
  aria-label="Markdown"
  {id}
  {...rest}
/>

<style>
  :global(.ds.markdown-editor-textarea) {
    resize: vertical;
  }
</style>
