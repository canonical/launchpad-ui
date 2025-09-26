<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/index.js";
  import { getFirstElement, getSiblingElement } from "$lib/utils";
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
  let selectedAction = $state<HTMLButtonElement>();

  const markdownEditorContext = getMarkdownEditorContext();

  const selectDefaultAction = () => {
    if (!ref) return;
    if (selectedAction && ref.contains(selectedAction)) return;

    selectedAction = getFirstElement({
      containerElement: ref,
      selector: "button.markdown-editor-toolbar-action-button:first-child",
      predicate: (action) => !action.disabled,
    }) as HTMLButtonElement;
  };

  setMarkdownEditorToolbarContext({
    set selectedAction(action) {
      selectedAction = action;
    },

    get selectedAction() {
      return selectedAction;
    },

    setDefaultAction() {
      selectDefaultAction();
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

    if (
      selectedAction &&
      ref &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      const nextAction = getSiblingElement({
        containerElement: ref,
        currentElement: selectedAction,
        selector: "button.markdown-editor-toolbar-action-button",
        direction: event.key === "ArrowLeft" ? "previous" : "next",
        predicate: (action) => !action.disabled,
        wrap: true,
      });
      if (nextAction) {
        nextAction.focus();
      }
    }
  };

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
      <ActionButton>
        {#snippet iconLeft()}
          <Icon name="task-list" />
        {/snippet}
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
