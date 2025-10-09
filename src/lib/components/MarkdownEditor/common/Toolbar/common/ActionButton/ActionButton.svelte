<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Button, Tooltip } from "$lib/components/index.js";
  import { useShortcuts } from "$lib/shortcuts/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import { ACTION_BUTTON_CSS_CLASS_NAME } from "./constant.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = `ds ${ACTION_BUTTON_CSS_CLASS_NAME}`;

  let {
    class: className,
    onfocus: onfocusProp,
    children,
    shortcut,
    modifiers,
    label,
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

  useShortcuts(() => shortcut);
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
      aria-keyshortcuts={shortcut?.toAriaLabel()}
      aria-label={label}
      {...triggerProps}
      {...rest}
    >
      {#snippet iconLeft()}
        {@render children()}
      {/snippet}
    </Button>
  {/snippet}
  <!-- TODO:  extract the shortcut label into a separate component (waiting for Enzo's design) -->
  {`${label}${shortcut ? ` (${shortcut.toHumanReadable()})` : ""}`}
</Tooltip>
