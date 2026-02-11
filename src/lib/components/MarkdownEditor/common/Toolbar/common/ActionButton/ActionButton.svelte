<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/Button/index.js";
  import { Tooltip } from "$lib/components/Tooltip/index.js";
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

  // Trigger a change in the toolbar context when the action button is mounted or becomes disabled
  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    disabled;
    markdownEditorToolbarContext?.notifyActionButtonChange();
  });

  onMount(() => {
    markdownEditorToolbarContext?.notifyActionButtonChange();
    return () => {
      markdownEditorToolbarContext?.notifyActionButtonChange();
    };
  });
</script>

<Tooltip>
  {#snippet trigger({ "aria-describedby": _, ...triggerProps })}
    <Button
      bind:ref={actionElement}
      class={[componentCssClassName, className]}
      tabindex={isInTabOrder ? 0 : -1}
      density="dense"
      severity="base"
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
