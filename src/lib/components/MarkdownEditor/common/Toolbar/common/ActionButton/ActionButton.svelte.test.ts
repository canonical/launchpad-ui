/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
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
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    })),
    label: "ActionButton",
  } satisfies ComponentProps<typeof Component>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect
        .element(element)
        .toHaveClass("markdown-editor-toolbar-action-button");
      await expect.element(element).toHaveClass("test-class");
    });
  });

  it("calls notifyActionButtonChange on mount", () => {
    render(Component, baseProps);
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(1);
  });

  it("calls notifyActionButtonChange on unmount", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
    page.unmount();
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(2);
  });

  it("sets selectedAction on focus", () => {
    const page = render(Component, baseProps);
    const button = componentLocator(page);
    const buttonEl = button.element() as HTMLButtonElement;
    buttonEl.focus();
    expect(setSelectedAction).toHaveBeenCalledTimes(1);
    expect(setSelectedAction).toHaveBeenCalledWith(buttonEl);
  });

  it("shows tooltip with label", async () => {
    const label = "ActionButton";
    const page = render(Component, { ...baseProps, label });
    const tooltip = page.getByRole("tooltip", { includeHidden: true });
    await expect.element(tooltip).toBeInTheDocument();
    await expect.element(tooltip).toHaveTextContent(label);
  });
  // TODO: it("tab index is -1 if the action button is disabled and is in tab order")
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button");
}
