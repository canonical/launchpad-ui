<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Textarea } from "$lib/components/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import "./styles.css";
  import type { TextareaProps } from "./types.js";
  import { applyAutoCompletions } from "./utils/applyAutoCompletions.js";
  import { calculateDynamicRows } from "./utils/calculateDynamicRows.js";

  const componentCssClassName = "ds markdown-editor-textarea";
  // source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows
  const defaultRows = 2;

  let {
    class: className,
    value = $bindable(),
    ref = $bindable(),
    onkeydown: onkeydownProp,
    oninput: oninputProp,
    disableAutoCompletions = false,
    maxRows = defaultRows * 2,
    rows: rowsProp,
    id: idProp,
    ...rest
  }: TextareaProps = $props();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);
  const markdownEditorContext = getMarkdownEditorContext();
  const initialRows = rowsProp ?? defaultRows;
  let rows = $state(initialRows);
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

  const oninput: typeof oninputProp = (event) => {
    oninputProp?.(event);
    if (maxRows !== undefined && ref) {
      rows = calculateDynamicRows(ref, initialRows, maxRows);
    }
  };
</script>

<Textarea
  bind:ref
  class={[componentCssClassName, className]}
  bind:value
  {onkeydown}
  {oninput}
  {rows}
  aria-label="Markdown"
  {id}
  {...rest}
/>
