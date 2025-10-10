/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { MarkdownEditorContext } from "$lib/components/MarkdownEditor/types";
import type { MarkdownEditorToolbarContext } from "../../types";
import Component from "./ActionButton.svelte";

const { ctx, setSelectedAction, notifyActionButtonChange } = vi.hoisted(() => {
  const setSelectedAction = vi.fn();
  const notifyActionButtonChange = vi.fn();
  let _selected: HTMLButtonElement | undefined;
  const ctx = {
    get selectedAction() {
      return _selected;
    },
    set selectedAction(el: HTMLButtonElement | undefined) {
      _selected = el;
      setSelectedAction(el);
    },
    notifyActionButtonChange,
  } satisfies MarkdownEditorToolbarContext;
  return { ctx, setSelectedAction, notifyActionButtonChange };
});

vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorToolbarContext: () => ctx,
  };
});

const { markdownCtx } = vi.hoisted(() => {
  const markdownCtx = {
    textareaElement: document.createElement("textarea"),
  } satisfies Partial<MarkdownEditorContext>;
  return { markdownCtx };
});

vi.mock("../../../../context.js", () => {
  return {
    getMarkdownEditorContext: () => markdownCtx,
  };
});

describe("Markdown Editor > Toolbar > Action button component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    }));

    const page = render(Component, { children, label: "ActionButton" });
    const element = page.getByRole("button");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    }));

    const page = render(Component, {
      children,
      class: "test-class",
      label: "ActionButton",
    });
    const element = page.getByRole("button");
    await expect.element(element).toHaveClass("test-class");
  });

  it("calls notifyActionButtonChange on mount", () => {
    render(Component, {
      label: "ActionButton",
      children: createRawSnippet(() => ({
        render: () => `<span>ActionButton</span>`,
      })),
    });
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(1);
  });

  it("calls notifyActionButtonChange on unmount", async () => {
    const page = render(Component, {
      label: "ActionButton",
      children: createRawSnippet(() => ({
        render: () => `<span>ActionButton</span>`,
      })),
    });
    await expect.element(page.getByRole("button")).toBeInTheDocument();
    page.unmount();
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(2);
  });

  it("sets selectedAction on focus", () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    }));

    const page = render(Component, { children, label: "ActionButton" });
    const button = page.getByRole("button");
    const buttonEl = button.element() as HTMLButtonElement;
    buttonEl.focus();
    expect(setSelectedAction).toHaveBeenCalledTimes(1);
    expect(setSelectedAction).toHaveBeenCalledWith(buttonEl);
  });

  it("shows tooltip with label", async () => {
    const label = "ActionButton";
    const page = render(Component, {
      label,
      children: createRawSnippet(() => ({
        render: () => `<span>ActionButton</span>`,
      })),
    });
    const tooltip = page.getByRole("tooltip", { includeHidden: true });
    await expect.element(tooltip).toBeInTheDocument();
    await expect.element(tooltip).toHaveTextContent(label);
  });
  // TODO: it("tab index is -1 if the action button is disabled and is in tab order")
});
