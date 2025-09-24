<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { Button } from "$lib/components/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import type { MarkdownEditorToolbarActionButtonProps } from "./types.js";

  const componentCssClassName =
    "ds markdown-editor-header-toolbar-action-button";

  let {
    class: className,
    onfocus: onfocusProp,
    disabled: disabledProp,
    ...rest
  }: MarkdownEditorToolbarActionButtonProps = $props();

  let actionElement = $state<HTMLButtonElement>();
  const markdownEditorToolbarContext = getMarkdownEditorToolbarContext();
  const mounted = useIsMounted();

  // disabled by default until JS is loaded
  const disabled = $derived(disabledProp ?? !mounted.value);

  const attachAction: Attachment<HTMLButtonElement> = (actionElement) => {
    markdownEditorToolbarContext?.addAction(actionElement);
  };

  onMount(() => {
    if (!actionElement) return;
    markdownEditorToolbarContext?.addAction(actionElement);
  });

  onDestroy(() => {
    if (!actionElement) return;
    markdownEditorToolbarContext?.addAction(actionElement);
  });

  const onfocus: typeof onfocusProp = (event) => {
    onfocusProp?.(event);
    if (!markdownEditorToolbarContext || !actionElement) return;
    markdownEditorToolbarContext.selectedAction = actionElement;
  };
</script>

<Button
  bind:ref={actionElement}
  class={[componentCssClassName, className]}
  modifiers={{ density: "dense", severity: "base", ...(rest.modifiers || {}) }}
  {onfocus}
  {@attach attachAction}
  {disabled}
  {...rest}
/>
