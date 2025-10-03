<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Button, Tooltip } from "$lib/components/index.js";
  import { match, parse } from "$lib/shortcut";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getMarkdownEditorContext } from "../../../../context.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import { ACTION_BUTTON_CSS_CLASS_NAME } from "./constant.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = `ds ${ACTION_BUTTON_CSS_CLASS_NAME}`;

  let {
    class: className,
    onfocus: onfocusProp,
    label,
    children,
    shortcut,
    callback,
    modifiers,
    ...rest
  }: ActionButtonProps = $props();

  let actionElement = $state<HTMLButtonElement>();
  const markdownEditorContext = getMarkdownEditorContext();
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

  const handleTextareaKeyDown = (event: KeyboardEvent) => {
    if (shortcut && match(event, shortcut)) {
      event.preventDefault();
      event.stopPropagation();
      handleCallback();
    }
  };
  // listen to the textarea keydown event
  $effect(() => {
    if (shortcut && markdownEditorContext?.textareaElement) {
      markdownEditorContext.textareaElement.addEventListener(
        "keydown",
        handleTextareaKeyDown,
      );
    }
    return () => {
      markdownEditorContext?.textareaElement?.removeEventListener(
        "keydown",
        handleTextareaKeyDown,
      );
    };
  });

  const handleCallback = () => {
    if (!markdownEditorContext?.textareaElement) return;
    callback?.(markdownEditorContext.textareaElement);
  };
</script>

<Tooltip>
  {#snippet trigger(triggerProps)}
    <Button
      bind:ref={actionElement}
      class={[componentCssClassName, className]}
      tabindex={isInTabOrder ? 0 : -1}
      modifiers={{ density: "dense", severity: "base", ...(modifiers || {}) }}
      {onfocus}
      {disabled}
      onclick={handleCallback}
      aria-label={label}
      {...triggerProps}
      {...rest}
    >
      {#snippet iconLeft()}
        {@render children()}
      {/snippet}
    </Button>
  {/snippet}
  {`${label}${
    shortcut
      ? ` (${parse(shortcut)
          .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
          .join(" + ")})`
      : ""
  }`}
</Tooltip>
