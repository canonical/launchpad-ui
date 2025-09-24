<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/index.js";
  import { modifiersValues } from "$lib/modifiers/utils.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import { ActionButton, Group } from "./common/index.js";
  import { setMarkdownEditorToolbarContext } from "./context.js";
  import type { MarkdownEditorToolbarProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar";

  let {
    class: className,
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: MarkdownEditorToolbarProps = $props();

  let toolbarElement = $state<HTMLDivElement>();
  let selectedActionIndex = $state<number>(0);
  let actionButtons = $state<HTMLButtonElement[]>([]);

  const markdownEditorContext = getMarkdownEditorContext();

  setMarkdownEditorToolbarContext({
    set selectedAction(action: HTMLButtonElement) {
      const index = actionButtons.indexOf(action);
      selectedActionIndex = index === -1 ? 0 : index;
    },

    get actions() {
      return actionButtons;
    },

    addAction(action: HTMLButtonElement) {
      if (actionButtons.includes(action)) return;
      actionButtons.push(action);
    },

    removeAction(action: HTMLButtonElement) {
      actionButtons = actionButtons.filter((a) => a !== action);
    },
  });

  $effect(() => {
    selectedActionIndex =
      selectedActionIndex > actionButtons.length - 1 ? 0 : selectedActionIndex;

    actionButtons.forEach((action, index) => {
      action.tabIndex = index === selectedActionIndex ? 0 : -1;
    });
  });

  /**
   * maintain the tab index property, where all actions have a
   * tab index of -1, except for the selected action
   *
   * this order is maintained even if the focus is moved to
   * another element and then back to the toolbar
   */
  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (!toolbarElement) return;

    if (
      !(event.target as HTMLElement).classList.contains(
        "markdown-editor-toolbar-action-button",
      )
    )
      return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      let nextFocusableAction: HTMLButtonElement | null = null;
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      for (let i = 1; i < actionButtons.length; i++) {
        const index =
          (selectedActionIndex + i * direction) % actionButtons.length;
        const action = actionButtons.at(index);
        if (action && !action.disabled) {
          nextFocusableAction = action;
          break;
        }
      }
      if (nextFocusableAction) {
        selectedActionIndex = actionButtons.indexOf(nextFocusableAction);
        nextFocusableAction.focus();
      }
    }
  };
</script>

<div
  class={[
    componentCssClassName,
    className,
    modifiersValues({ density: "dense", severity: "base" }),
  ]}
  role="toolbar"
  aria-orientation="horizontal"
  {onkeydown}
  bind:this={toolbarElement}
  {...rest}
>
  <Group>
    <ActionButton
      onclick={() => {
        // TODO: temporary placeholder, to be replaced with an action management system
        if (markdownEditorContext?.textareaElement) {
          markdownEditorContext.textareaElement.focus();
          document.execCommand("insertText", false, "# ");
        }
      }}
    >
      {#snippet iconLeft()}
        <Icon name="heading" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="bold" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="italic" />
      {/snippet}
    </ActionButton>
  </Group>
  <Group>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="quote" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="code" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="get-link" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="bulleted-list" />
      {/snippet}
    </ActionButton>
    <ActionButton>
      {#snippet iconLeft()}
        <Icon name="numbered-list" />
      {/snippet}
    </ActionButton>
  </Group>

  {@render children?.()}
</div>

<style>
  .ds.markdown-editor-toolbar {
    --dimension-gap-markdown-editor-toolbar: var(
      --tmp-dimension-spacing-inline-xxs
    );
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--dimension-gap-markdown-editor-toolbar);
  }

  @container (max-width: 410px) {
    .ds.markdown-editor-toolbar {
      display: none;
    }
  }
</style>
