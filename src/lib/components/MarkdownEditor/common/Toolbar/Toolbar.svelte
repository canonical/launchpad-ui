<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import { ActionButton, Group } from "./common/index.js";
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
  let actionButtons = $state<HTMLButtonElement[]>([]);
  let selectedAction = $derived(
    actionButtons.find((action) => !action.disabled),
  );

  const markdownEditorContext = getMarkdownEditorContext();

  setMarkdownEditorToolbarContext({
    set selectedAction(action) {
      if (action === undefined) {
        selectedAction = actionButtons.find((action) => !action.disabled);
      } else {
        selectedAction = action;
      }
    },

    get selectedAction() {
      return selectedAction;
    },

    get actions() {
      return actionButtons;
    },

    addAction(action) {
      if (actionButtons.includes(action)) return;
      actionButtons.push(action);
      actionButtons.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        if (position === Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1;
        } else if (position === Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        } else {
          return 0;
        }
      });
    },

    removeAction(action) {
      actionButtons = actionButtons.filter((a) => a !== action);
    },
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
    if (
      !(event.target as HTMLElement).classList.contains(
        "markdown-editor-toolbar-action-button",
      )
    )
      return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      let selectedActionIndex = 0;
      if (selectedAction) {
        const index = actionButtons.indexOf(selectedAction);
        if (index !== -1) {
          selectedActionIndex = index;
        }
      }
      for (let i = 1; i < actionButtons.length; i++) {
        const index =
          (selectedActionIndex + i * direction) % actionButtons.length;
        const action = actionButtons.at(index);
        if (action && !action.disabled) {
          selectedActionIndex = actionButtons.indexOf(action);
          action.focus();
          break;
        }
      }
    }
  };
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
  {/if}

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

  /* defined in .ds.markdown-editor */
  @container (max-width: 410px) {
    .ds.markdown-editor-toolbar {
      display: none;
    }
  }
</style>
