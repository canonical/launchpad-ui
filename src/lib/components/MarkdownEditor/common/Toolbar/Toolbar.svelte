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

  const actions = new SvelteSet<ActionItem>();
  let activeAction = $state<HTMLButtonElement>();

  function getNavigableItems(): ActionItem[] {
    return [...actions]
      .filter((item) => !item.disabled)
      .toSorted((a, b) =>
        a.element.compareDocumentPosition(b.element) &
        Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      );
  }

  const tabStopAction = $derived.by(() => {
    const navigable = getNavigableItems();
    return (
      navigable.find((item) => item.element === activeAction) ?? navigable.at(0)
    )?.element;
  });

  setMarkdownEditorToolbarContext({
    registerAction(item) {
      actions.add(item);
      return () => actions.delete(item);
    },
    setActiveAction(element) {
      activeAction = element;
    },
    isTabStop(element) {
      return tabStopAction === element;
    },
  });

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const navigable = getNavigableItems();
    const currentIndex = navigable.findIndex(
      (item) => item.element === event.target,
    );
    if (currentIndex === -1) return;

    const offset = event.key === "ArrowLeft" ? -1 : 1;
    const toFocus = navigable.at(
      (currentIndex + offset) % navigable.length,
    )?.element;

    if (toFocus) {
      toFocus.focus();
      event.preventDefault();
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
