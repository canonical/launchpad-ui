<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { getFirstElement, getSiblingElement } from "$lib/utils/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import {
    ACTION_BUTTON_CSS_CLASS_NAME,
    DefaultActions,
  } from "./common/index.js";
  import { setMarkdownEditorToolbarContext } from "./context.js";
  import type { ToolbarProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar";

  let {
    class: className,
    ref = $bindable(),
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: ToolbarProps = $props();
  const markdownEditorContext = getMarkdownEditorContext();
  let selectedAction = $state<HTMLButtonElement>();
  /**
   * Select the default action when the toolbar is mounted
   * This can be called as many times as needed
   * where it will only change if the current action is not valid
   */
  const selectDefaultAction = () => {
    if (!ref) return;
    const isCurrentActionValid =
      selectedAction &&
      ref.contains(selectedAction) &&
      !selectedAction.disabled;
    // If the current action is valid, don't change it
    if (isCurrentActionValid) return;

    selectedAction =
      getFirstElement<HTMLButtonElement>({
        containerElement: ref,
        selector: `.${ACTION_BUTTON_CSS_CLASS_NAME}`,
        predicate: (action) => !action.disabled,
      }) ?? undefined;
  };

  setMarkdownEditorToolbarContext({
    set selectedAction(action) {
      selectedAction = action;
    },

    get selectedAction() {
      return selectedAction;
    },
    notifyActionButtonChange: selectDefaultAction,
  });

  /**
   * Adds additional event handling for the toolbar, to navigate between action buttons.
   * It is used to navigate between action buttons using the arrow keys.
   */
  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (
      !(event.target as HTMLElement)?.classList?.contains(
        ACTION_BUTTON_CSS_CLASS_NAME,
      )
    )
      return;

    if (
      selectedAction &&
      ref &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      const nextAction = getSiblingElement({
        containerElement: ref,
        currentElement: selectedAction,
        selector: `.${ACTION_BUTTON_CSS_CLASS_NAME}`,
        direction: event.key === "ArrowLeft" ? "previous" : "next",
        predicate: (action) => !action.disabled,
        wrap: true,
      });
      if (nextAction) {
        nextAction.focus();
      }
    }
  };
</script>

<div
  class={[componentCssClassName, className]}
  role="toolbar"
  aria-orientation="horizontal"
  aria-label="Text formatting"
  aria-controls={markdownEditorContext?.textareaId}
  {onkeydown}
  bind:this={ref}
  {...rest}
>
  <DefaultActions />
  {@render children?.()}
</div>

<style>
  .ds.markdown-editor-toolbar {
    --dimension-gap-markdown-editor-toolbar: var(
      --lp-dimension-spacing-inline-minimum
    );
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--dimension-gap-markdown-editor-toolbar);
  }

  @media (scripting: none) {
    .ds.markdown-editor-toolbar {
      display: none;
    }
  }
</style>
