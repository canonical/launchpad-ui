/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Helper.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Helper text</span>",
}));

describe("Helper component", () => {
  describe("Renders", () => {
    it("with required props", async () => {
      const page = render(Component, { children, id: "helper-id" });
      await expect.element(testIdLocator(page)).toBeInTheDocument();
    });

    it("with icon", async () => {
      const page = render(Component, {
        children,
        id: "helper-id",
        icon: createRawSnippet(() => ({
          render: () => '<span data-testid="test-icon">Test Icon</span>',
        })),
      });
      await expect.element(testIdLocator(page)).toBeInTheDocument();
      await expect.element(page.getByTestId("test-icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { children, id: "test-id" });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        children,
        id: "test-id",
        class: "test-class",
      });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        children,
        id: "test-id",
        style: "color: red;",
      });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("helper");
}
