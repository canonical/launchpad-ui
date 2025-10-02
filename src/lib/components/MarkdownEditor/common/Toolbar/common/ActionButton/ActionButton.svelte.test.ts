/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
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

  it("calls notifyActionButtonChange on mount", () => {
    render(Component);
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(1);
  });

  it("calls notifyActionButtonChange on unmount", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("button")).toBeInTheDocument();
    page.unmount();
    expect(notifyActionButtonChange).toHaveBeenCalledTimes(2);
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

  // it("tab index is -1 if the action button is disabled and is in tab order", async () => {
  //   const children = createRawSnippet(() => ({
  //     render: () => `<span>ActionButton</span>`,
  //   }));
  //   const props = $state({ disabled: false, children });
  //   const page = render(Component, { props });
  //   const button = page.getByRole("button");
  //   const buttonEl = button.element() as HTMLButtonElement;
  //   buttonEl.focus();
  //   await expect.element(button).toHaveAttribute("tabindex", "0");
  //   // props.disabled = true;
  //   await expect.element(button).toHaveAttribute("tabindex", "-1");
  // });
});
