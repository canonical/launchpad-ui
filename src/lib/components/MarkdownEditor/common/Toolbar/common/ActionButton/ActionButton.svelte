<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Button } from "$lib/components/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-action-button";

  let {
    class: className,
    onfocus: onfocusProp,
    disabled: disabledProp,
    modifiers,
    ...rest
  }: ActionButtonProps = $props();

  let actionElement = $state<HTMLButtonElement>();
  const markdownEditorToolbarContext = getMarkdownEditorToolbarContext();
  const mounted = useIsMounted();

  const onfocus: typeof onfocusProp = (event) => {
    onfocusProp?.(event);
    if (!markdownEditorToolbarContext || !actionElement) return;
    markdownEditorToolbarContext.selectedAction = actionElement;
  };

  const isInTabOrder = $derived(
    actionElement &&
      markdownEditorToolbarContext?.selectedAction === actionElement,
  );
  // disabled by default until JS is loaded
  const disabled = $derived(disabledProp ?? !mounted.value);

  // Unselect the action button if it becomes disabled and is in tab order
  $effect(() => {
    if (
      disabled &&
      untrack(() => isInTabOrder) &&
      markdownEditorToolbarContext
    ) {
      markdownEditorToolbarContext.selectedAction = undefined;
    }
  });

  onMount(() => {
    if (markdownEditorToolbarContext) {
      markdownEditorToolbarContext.setDefaultAction();
    }
    return () => {
      if (markdownEditorToolbarContext) {
        markdownEditorToolbarContext.setDefaultAction();
      }
    };
  });
</script>

<Button
  bind:ref={actionElement}
  class={[componentCssClassName, className]}
  tabindex={isInTabOrder ? 0 : -1}
  modifiers={{ density: "dense", severity: "base", ...(modifiers || {}) }}
  data-disabled={disabledProp}
  {onfocus}
  {disabled}
  {...rest}
/>
