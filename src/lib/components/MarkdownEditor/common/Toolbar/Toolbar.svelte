<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/index.js";
  import { getFirstElement, getSiblingElement } from "$lib/utils";
  import {
    ACTION_BUTTON_CSS_CLASS_NAME,
    ActionButton,
    Group,
  } from "./common/index.js";
  import { setMarkdownEditorToolbarContext } from "./context.js";
  import type { ToolbarProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar";

  let {
    noDefaultActions = false,
    class: className,
    ref = $bindable(),
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: ToolbarProps = $props();
  let containerWidth = $state<number>();
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

  // select the default action when the toolbar is mounted
  $effect(() => {
    selectDefaultAction();
  });
</script>

<div
  class={[componentCssClassName, className]}
  role="toolbar"
  aria-orientation="horizontal"
  {onkeydown}
  bind:this={ref}
  {...rest}
>
  {#if !noDefaultActions}
    <Group bind:containerWidth>
      <ActionButton
        label="Heading"
        shortcut="ctrl+alt+1"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "# ");
        }}
      >
        <Icon name="heading" />
      </ActionButton>
      <ActionButton
        label="Bold"
        shortcut="ctrl+b"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "**");
        }}
      >
        <Icon name="bold" />
      </ActionButton>
      <ActionButton
        label="Italic"
        shortcut="ctrl+i"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "*");
        }}
      >
        <Icon name="italic" />
      </ActionButton>
    </Group>
    <Group>
      <ActionButton
        label="Quote"
        shortcut="ctrl+shift+0"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "> ");
        }}
      >
        <Icon name="quote" />
      </ActionButton>
      <ActionButton
        label="Code"
        shortcut="ctrl+e"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "`");
        }}
      >
        <Icon name="code" />
      </ActionButton>
      <ActionButton
        label="Insert Link"
        shortcut="ctrl+k"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "[");
        }}
      >
        <Icon name="get-link" />
      </ActionButton>
      <ActionButton
        label="Unordered List"
        shortcut="ctrl+shift+8"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "- ");
        }}
      >
        <Icon name="bulleted-list" />
      </ActionButton>
      <ActionButton
        label="Numbered List"
        shortcut="ctrl+shift+7"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "1. ");
        }}
      >
        <Icon name="numbered-list" />
      </ActionButton>
      <ActionButton
        label="Task List"
        shortcut="ctrl+shift+9"
        callback={(textarea) => {
          // TODO: temporary placeholder, to be replaced with an action management system
          textarea.focus();
          document.execCommand("insertText", false, "- [ ] ");
        }}
      >
        <Icon name="task-list" />
      </ActionButton>
    </Group>
  {/if}

  {@render children?.()}
</div>

<style>
  .ds.markdown-editor-toolbar {
    --dimension-gap-markdown-editor-toolbar: var(
      --tmp-dimension-spacing-inline-minimum
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
