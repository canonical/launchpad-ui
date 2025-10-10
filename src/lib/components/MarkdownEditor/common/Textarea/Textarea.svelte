<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Textarea } from "$lib/components/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import "./styles.css";
  import type { TextareaProps } from "./types.js";
  import { autoCompletions } from "./utils/auto-completions.js";

  const componentCssClassName = "ds markdown-editor-textarea";

  let {
    class: className,
    value = $bindable(),
    ref = $bindable(),
    onkeydown: onkeydownProp,
    disableAutoCompletions = false,
    ...rest
  }: TextareaProps = $props();

  const markdownEditorContext = getMarkdownEditorContext();

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

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (!ref || disableAutoCompletions) return;
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      if (autoCompletions(ref)) {
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
  {...rest}
/>
