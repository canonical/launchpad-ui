<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { SvelteSet } from "svelte/reactivity";
  import { getMarkdownEditorContext } from "../../context.js";
  import { DefaultActions } from "./common/index.js";
  import { setMarkdownEditorToolbarContext } from "./context.js";
  import type { ActionItem, ToolbarProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar";

  let {
    class: className,
    ref = $bindable(),
    children,
    onkeydown: onkeydownProp,
    ...rest
  }: ToolbarProps = $props();
  const markdownEditorContext = getMarkdownEditorContext();

  const actionItems = new SvelteSet<ActionItem>();
  let activeActionElement = $state<HTMLButtonElement>();

  function getNavigableActionItems(): ActionItem[] {
    return [...actionItems]
      .filter((item) => !item.disabled)
      .toSorted((a, b) =>
        a.element.compareDocumentPosition(b.element) &
        Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      );
  }

  const tabStopAction = $derived.by(() => {
    const navigableActionItems = getNavigableActionItems();
    return (
      navigableActionItems.find(
        (item) => item.element === activeActionElement,
      ) ?? navigableActionItems.at(0)
    )?.element;
  });

  setMarkdownEditorToolbarContext({
    registerActionItem(item) {
      actionItems.add(item);
      return () => actionItems.delete(item);
    },
    setActiveActionElement(element) {
      activeActionElement = element;
    },
    isTabStop(element) {
      return tabStopAction === element;
    },
  });

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const navigableActionItems = getNavigableActionItems();
    const currentIndex = navigableActionItems.findIndex(
      (item) => item.element === event.target,
    );
    if (currentIndex === -1) return;

    const offset = event.key === "ArrowLeft" ? -1 : 1;
    const toFocus = navigableActionItems.at(
      (currentIndex + offset) % navigableActionItems.length,
    )?.element;

    if (!toFocus) return;

    toFocus.focus();
    event.preventDefault();
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
  <!-- Used in MarkdownEditor.stories.svelte and test.fixtures.svelte to test the focus management -->
  {#if !rest["data-test-no-default-actions"]}
    <DefaultActions />
  {/if}
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
