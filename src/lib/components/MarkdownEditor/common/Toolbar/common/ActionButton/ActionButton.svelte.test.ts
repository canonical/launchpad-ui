/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { MarkdownEditorContext } from "$lib/components/MarkdownEditor/types";
import type { MarkdownEditorToolbarContext } from "../../types";
import Component from "./ActionButton.svelte";

const {
  ctx,
  registerActionItem,
  unregisterAction,
  setActiveActionElement,
  setIsTabStop,
} = vi.hoisted(() => {
  let isTabStop = false;

  const unregisterAction = vi.fn();
  const registerActionItem = vi.fn(() => unregisterAction);
  const setActiveActionElement = vi.fn();
  const ctx = {
    registerActionItem,
    setActiveActionElement,
    isTabStop: () => isTabStop,
  } satisfies MarkdownEditorToolbarContext;
  return {
    ctx,
    registerActionItem,
    unregisterAction,
    setActiveActionElement,
    setIsTabStop: (value: boolean) => (isTabStop = value),
  };
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
    setIsTabStop(false);
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

  it("registers the action on mount", () => {
    render(Component, baseProps);
    expect(registerActionItem).toHaveBeenCalledTimes(1);
  });

  it("unregisters the action on unmount", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
    page.unmount();
    expect(unregisterAction).toHaveBeenCalledTimes(1);
  });

  it("sets the active action on focus", () => {
    const page = render(Component, baseProps);
    const button = componentLocator(page);
    const buttonEl = button.element() as HTMLButtonElement;
    buttonEl.focus();
    expect(setActiveActionElement).toHaveBeenCalledTimes(1);
    expect(setActiveActionElement).toHaveBeenCalledWith(buttonEl);
  });

  it("shows tooltip with label", async () => {
    const label = "ActionButton";
    const page = render(Component, { ...baseProps, label });
    const tooltip = page.getByRole("tooltip", { includeHidden: true });
    await expect.element(tooltip).toBeInTheDocument();
    await expect.element(tooltip).toHaveTextContent(label);
  });

  describe("tab stop", () => {
    it("has tabIndex=-1 if its not the tab stop", async () => {
      setIsTabStop(false);
      const page = render(Component, baseProps);
      const button = componentLocator(page);
      await expect.element(button).toHaveAttribute("tabindex", "-1");
    });

    it("has tabIndex=0 if its the tab stop", async () => {
      setIsTabStop(true);
      const page = render(Component, baseProps);
      const button = componentLocator(page);
      await expect.element(button).toHaveAttribute("tabindex", "0");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button");
}
