<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/index.js";
  import { getFirstElement, getSiblingElement } from "$lib/utils/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import {
    ACTION_BUTTON_CSS_CLASS_NAME,
    ActionButton,
    Group,
  } from "./common/index.js";
  import { setMarkdownEditorToolbarContext } from "./context.js";
  import type { ToolbarProps } from "./types.js";
  import { createDefaultShortcuts } from "./utils/shortcuts.js";

  const componentCssClassName = "ds markdown-editor-toolbar";

  let {
    noDefaultActions = false,
    class: className,
    ref = $bindable(),
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: ToolbarProps = $props();
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

  const markdownEditorContext = getMarkdownEditorContext();
  const defaultShortcuts = createDefaultShortcuts(
    () => markdownEditorContext?.textareaElement,
  );
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
    <Group>
      <ActionButton shortcut={defaultShortcuts.h1} label="Add heading 1">
        <Icon name="heading" />
      </ActionButton>
      <ActionButton shortcut={defaultShortcuts.bold} label="Add bold">
        <Icon name="bold" />
      </ActionButton>
      <ActionButton shortcut={defaultShortcuts.italic} label="Add italic">
        <Icon name="italic" />
      </ActionButton>
    </Group>
    <Group>
      <ActionButton shortcut={defaultShortcuts.quote} label="Add quote">
        <Icon name="quote" />
      </ActionButton>
      <ActionButton shortcut={defaultShortcuts.code} label="Add code">
        <Icon name="code" />
      </ActionButton>
      <ActionButton shortcut={defaultShortcuts.insertLink} label="Add link">
        <Icon name="get-link" />
      </ActionButton>
      <ActionButton
        shortcut={defaultShortcuts.unorderedList}
        label="Add bullet list"
      >
        <Icon name="bulleted-list" />
      </ActionButton>
      <ActionButton
        shortcut={defaultShortcuts.numberedList}
        label="Add numbered list"
      >
        <Icon name="numbered-list" />
      </ActionButton>
      <ActionButton
        shortcut={defaultShortcuts.numberedList}
        label="Add numbered list"
      >
        <Icon name="numbered-list" />
      </ActionButton>
      <ActionButton shortcut={defaultShortcuts.taskList} label="Add task list">
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
