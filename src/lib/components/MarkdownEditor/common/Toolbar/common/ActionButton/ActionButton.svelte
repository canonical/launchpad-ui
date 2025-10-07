<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { getMarkdownEditorContext } from "$lib/components/MarkdownEditor/context.js";
  import { Button, Spinner, Tooltip } from "$lib/components/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { assertDefined } from "$lib/utils/assert.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import { ACTION_BUTTON_CSS_CLASS_NAME } from "./constant.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = `ds ${ACTION_BUTTON_CSS_CLASS_NAME}`;

  let {
    class: className,
    onfocus: onfocusProp,
    onclick: onclickProp,
    children,
    shortcut,
    modifiers,
    loading,
    label,
    ...rest
  }: ActionButtonProps = $props();

  const actionLabel = $derived.by(() => {
    const actionLabel = label ? label : shortcut?.label;
    assertDefined(actionLabel, "Action label is required");
    return actionLabel;
  });

  let actionElement = $state<HTMLButtonElement>();
  const markdownEditorToolbarContext = getMarkdownEditorToolbarContext();
  const markdownEditorContext = getMarkdownEditorContext();
  const mounted = useIsMounted();

  const onfocus: typeof onfocusProp = (event) => {
    onfocusProp?.(event);
    if (!markdownEditorToolbarContext || !actionElement) return;
    markdownEditorToolbarContext.selectedAction = actionElement;
  };

  const onclick: typeof onclickProp = (event) => {
    onclickProp?.(event);
    if (!markdownEditorContext?.textareaElement || !actionElement) return;
    shortcut?.callback(markdownEditorContext.textareaElement);
  };

  const isInTabOrder = $derived(
    actionElement &&
      markdownEditorToolbarContext?.selectedAction === actionElement,
  );
  // disabled by default until JS is loaded
  const disabled = $derived(!mounted.value);

  // Unselect the action button if it becomes disabled and is in tab order
  $effect(() => {
    if (disabled && untrack(() => isInTabOrder)) {
      markdownEditorToolbarContext?.notifyActionButtonChange();
    }
  });

  onMount(() => {
    markdownEditorToolbarContext?.notifyActionButtonChange();
    return () => {
      markdownEditorToolbarContext?.notifyActionButtonChange();
    };
  });
</script>

<Tooltip>
  {#snippet trigger(triggerProps)}
    <Button
      bind:ref={actionElement}
      class={[componentCssClassName, className]}
      tabindex={isInTabOrder ? 0 : -1}
      modifiers={{ density: "dense", severity: "base", ...(modifiers || {}) }}
      {onclick}
      {onfocus}
      {disabled}
      aria-keyshortcuts={shortcut?.toAriaLabel()}
      aria-label={actionLabel}
      {loading}
      {...triggerProps}
      {...rest}
    >
      {#snippet iconLeft()}
        {#if loading}
          <Spinner />
        {:else}
          {@render children()}
        {/if}
      {/snippet}
    </Button>
  {/snippet}
  <!-- TODO:  extract the shortcut label into a separate component (waiting for Enzo's design) -->
  {`${actionLabel}${shortcut ? ` (${shortcut.toHumanReadable()})` : ""}`}
</Tooltip>
