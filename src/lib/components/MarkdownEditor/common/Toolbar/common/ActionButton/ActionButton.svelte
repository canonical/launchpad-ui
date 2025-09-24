<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import type { MarkdownEditorToolbarActionButtonProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-action-button";

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

  onMount(() => {
    if (!actionElement) return;
    markdownEditorToolbarContext?.addAction(actionElement);

    return () => {
      if (!actionElement) return;
      markdownEditorToolbarContext?.removeAction(actionElement);
    };
  });

  const onfocus: typeof onfocusProp = (event) => {
    onfocusProp?.(event);
    if (!markdownEditorToolbarContext || !actionElement) return;
    markdownEditorToolbarContext.selectedAction = actionElement;
  };

  const isButtonTabIndexed = $derived(
    actionElement &&
      markdownEditorToolbarContext?.selectedAction === actionElement,
  );

  $effect(() => {
    if (isButtonTabIndexed && disabled && markdownEditorToolbarContext) {
      markdownEditorToolbarContext.selectedAction = undefined;
    }
  });
</script>

<Button
  bind:ref={actionElement}
  class={[componentCssClassName, className]}
  tabindex={isButtonTabIndexed ? 0 : -1}
  modifiers={{ density: "dense", severity: "base", ...(rest.modifiers || {}) }}
  {onfocus}
  {disabled}
  {...rest}
/>
