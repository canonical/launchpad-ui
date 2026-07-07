<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import {
    Button,
    Tooltip,
    useIsMounted,
  } from "@canonical/svelte-ds-app-launchpad";
  import type { Attachment } from "svelte/attachments";
  import { getMarkdownEditorToolbarContext } from "../../context.js";
  import type { ActionButtonProps } from "./types.js";

  const componentCssClassName = `ds markdown-editor-toolbar-action-button`;

  let {
    class: className,
    onfocus: onfocusProp,
    children,
    shortcut,
    label,
    disabled: disabledProp,
    ...rest
  }: ActionButtonProps = $props();

  const markdownEditorToolbarContext = getMarkdownEditorToolbarContext();
  const mounted = useIsMounted();
  const disabled = $derived(!mounted.value || Boolean(disabledProp));

  const registerAction: Attachment<HTMLButtonElement> = (element) => {
    console.log("register");
    const unregister = markdownEditorToolbarContext?.registerAction({
      element,
      get disabled() {
        return disabled;
      },
    });
    return () => unregister?.();
  };

  let actionElement = $state<HTMLButtonElement>();
  const isTabStop = $derived(
    !!actionElement && markdownEditorToolbarContext?.isTabStop(actionElement),
  );

  const onfocus: typeof onfocusProp = (event) => {
    onfocusProp?.(event);
    markdownEditorToolbarContext?.setActiveAction(event.currentTarget);
  };
</script>

<Tooltip>
  {#snippet trigger({ "aria-describedby": _, ...triggerProps })}
    <Button
      bind:ref={actionElement}
      class={[componentCssClassName, className]}
      tabindex={isTabStop ? 0 : -1}
      density="dense"
      severity="base"
      {onfocus}
      {disabled}
      aria-keyshortcuts={shortcut?.toAriaLabel()}
      aria-label={label}
      {...triggerProps}
      {...rest}
      {@attach registerAction}
    >
      {#snippet iconLeft()}
        {@render children()}
      {/snippet}
    </Button>
  {/snippet}
  <!-- TODO:  extract the shortcut label into a separate component (waiting for Enzo's design) -->
  {`${label}${shortcut ? ` (${shortcut.toHumanReadable()})` : ""}`}
</Tooltip>
