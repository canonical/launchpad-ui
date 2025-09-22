<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Button, Icon } from "$lib/components/index.js";
  import { modifiersValues } from "$lib/modifiers/utils.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import { Group } from "./common/index.js";
  import type { ToolbarProps } from "./types.js";
  import { getSiblingActionElement } from "./utils/index.js";

  const componentCssClassName = "ds toolbar";

  let {
    class: className,
    children,
    actions,
    onkeydown: onkeydownProp,
    ...rest
  }: ToolbarProps = $props();

  let toolbarElement = $state<HTMLDivElement>();
  const markdownEditorContext = getMarkdownEditorContext();

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
    if (event.target instanceof HTMLButtonElement) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const siblingActionElement = getSiblingActionElement(
          toolbarElement,
          event,
        );
        if (siblingActionElement) {
          siblingActionElement.focus();
          event.target.tabIndex = -1;
          siblingActionElement.tabIndex = 0;
        }
      }
    }
  };

  /**
   * on action button click we to set all other action buttons
   * to have a tab index of -1 and the target button to have a tab index of 0.
   *
   * this ensures that the last used action button is the default focusable element.
   */
  const onactionbuttonclick = (target: HTMLButtonElement) => {
    const actions =
      toolbarElement?.querySelectorAll<HTMLButtonElement>("button");
    actions?.forEach((action) => {
      action.tabIndex = action === target ? 0 : -1;
    });
    target.focus();
  };

  $effect(() => {
    // init tab indexes to -1, except for the first action
    // which is the default first focusable element to have a tab index 0
    if (toolbarElement) {
      const actions = toolbarElement.querySelectorAll("button");
      actions.forEach((action, index) => {
        action.tabIndex = index === 0 ? 0 : -1;

        // attack an event listener to the action button to set the tab index
        action.addEventListener("focus", () => onactionbuttonclick(action));
      });
    }
  });
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
    <Button
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
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="bold" />
      {/snippet}
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="italic" />
      {/snippet}
    </Button>
  </Group>
  <Group>
    <Button>
      {#snippet iconLeft()}
        <Icon name="quote" />
      {/snippet}
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="code" />
      {/snippet}
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="get-link" />
      {/snippet}
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="bulleted-list" />
      {/snippet}
    </Button>
    <Button>
      {#snippet iconLeft()}
        <Icon name="numbered-list" />
      {/snippet}
    </Button>
  </Group>
  {@render actions?.()}
  {#if children}
    <div class="controls">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .ds.toolbar {
    --dimension-gap-markdown-editor-toolbar: var(
      --tmp-dimension-spacing-inline-xxs
    );
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--dimension-gap-markdown-editor-toolbar);

    > .controls {
      margin-inline-start: auto;
    }
  }
</style>
