/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";

const textareaId = ":c1:";
vi.mock("../../context.js", () => {
  return {
    getMarkdownEditorContext: () => ({
      textareaId,
    }),
  };
});

vi.mock("$lib/shortcuts/index.js", async (importActual) => {
  const actual = await importActual<typeof import("$lib/shortcuts/index.js")>();
  const useShortcuts = () => () => [];
  return {
    ...actual,
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts,
  };
});

describe("Markdown Editor > Toolbar component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

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
      await expect.element(element).toHaveClass("markdown-editor-toolbar");
      await expect.element(element).toHaveClass("test-class");
    });
  });

  it("applies aria-controls", async () => {
    const page = render(Component, baseProps);
    await expect
      .element(componentLocator(page))
      .toHaveAttribute("aria-controls", textareaId);
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("toolbar");
}
