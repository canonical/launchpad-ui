<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { Button } from "$lib/components/index.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-action-button";

  let {
    class: className,
    onfocus: onfocusProp,
    ...rest
  }: ActionButtonProps = $props();
  let actionElement = $state<HTMLButtonElement>();
  const markdownEditorToolbarContext = getMarkdownEditorToolbarContext();

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
  {onfocus}
  {@attach attachAction}
  {...rest}
/>
