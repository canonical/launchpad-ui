<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Textarea } from "$lib/components/index.js";
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
  {...rest}
/>
