/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Header.svelte";

describe("Markdown Editor > Header component", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => "<span>Header</span>",
    })),
  } satisfies ComponentProps<typeof Component>;
  it("renders", async () => {
    const page = render(Component, baseProps);
    const element = page.getByText("Header");
    await expect.element(element).toBeInTheDocument();
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
      await expect.element(element).toHaveClass("markdown-editor-header");
      await expect.element(element).toHaveClass("test-class");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("markdown-editor-header");
}
