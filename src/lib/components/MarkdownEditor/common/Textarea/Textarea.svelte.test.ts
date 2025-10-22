/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
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

describe("Markdown Editor > Textarea component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

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
      await expect.element(element).toHaveClass("markdown-editor-textarea");
      await expect.element(element).toHaveClass("test-class");
    });
  });

  it("sets textareaElement in context with the element ref", async () => {
    const page = render(Component, baseProps);
    const element = componentLocator(page);
    await expect.element(element).toBeInTheDocument();
    expect(setTextareaElement).toHaveBeenCalledExactlyOnceWith(
      element.element(),
    );
  });

  it("clears textareaElement in context when the component is unmounted", async () => {
    const page = render(Component, baseProps);
    const element = componentLocator(page);
    await expect.element(element).toBeInTheDocument();
    page.unmount();
    expect(setTextareaElement).toHaveBeenCalledWith(undefined);
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("textbox");
}
