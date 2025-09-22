/* @canonical/generator-ds 0.10.0-experimental.3 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Textarea.svelte";

const { setTextareaElement } = vi.hoisted(() => {
  const setTextareaElement = vi.fn();
  return { setTextareaElement };
});

vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorContext: () => ({
      set textareaElement(el: HTMLTextAreaElement | null) {
        setTextareaElement(el);
      },
    }),
  };
});

describe("Textarea component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const page = render(Component);
    const element = page.getByRole("textbox");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, { class: "test-class" });
    const element = page.getByRole("textbox");
    await expect.element(element).toHaveClass("test-class");
  });

  it("sets textareaElement in context with the element ref", async () => {
    const page = render(Component);
    const element = page.getByRole("textbox");
    await expect.element(element).toBeInTheDocument();
    expect(setTextareaElement).toHaveBeenCalledExactlyOnceWith(
      element.element(),
    );
  });
});
