/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ContextualMenu.svelte";

describe("ContextualMenu component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(testIdLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id" });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
      });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
      });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });

  describe("Helper linking", () => {
    it("doesn't have aria-describedby by default", async () => {
      const page = render(Component);
      await expect
        .element(testIdLocator(page))
        .not.toHaveAttribute("aria-describedby");
    });

    it("has aria-describedby properly linked to helper if it is present", async () => {
      const page = render(Component, {
        helper: createRawSnippet<[string]>((id) => ({
          render: () => `<div id="${id()}">Test helper text</div>`,
        })),
      });

      await expect
        .element(testIdLocator(page))
        .toHaveAccessibleDescription("Test helper text");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("contextual-menu");
}
