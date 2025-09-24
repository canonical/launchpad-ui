/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./ActionButton.svelte";

const { addAction, setSelectedAction, removeAction } = vi.hoisted(() => {
  const addAction = vi.fn();
  const setSelectedAction = vi.fn();
  const removeAction = vi.fn();
  return { addAction, setSelectedAction, removeAction };
});

vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorToolbarContext: () => ({
      addAction,
      set selectedAction(el: HTMLButtonElement | undefined) {
        setSelectedAction(el);
      },
      removeAction,
    }),
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

    const page = render(Component, { children });
    const element = page.getByRole("button");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByRole("button");
    await expect.element(element).toHaveClass("test-class");
  });

  it("calls addAction on attach and mount", () => {
    render(Component);
    expect(addAction).toHaveBeenCalledTimes(2);
  });

  it("sets selectedAction on focus", () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    }));

    const page = render(Component, { children });
    const button = page.getByRole("button");
    const buttonEl = button.element() as HTMLButtonElement;
    buttonEl.focus();
    expect(setSelectedAction).toHaveBeenCalledTimes(1);
    expect(setSelectedAction).toHaveBeenCalledWith(buttonEl);
  });
});
