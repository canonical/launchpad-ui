/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Helper.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Helper text</span>",
}));

const baseProps = {
  children,
  id: "helper-id",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns a locator for the Helper component.
 * Uses testId as the component doesn't have a single semantic role.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentLocator(page: RenderResult<any>): Locator {
  return page.getByTestId("helper");
}

describe("Helper component", () => {
  describe("Renders", () => {
    it("with required props", async () => {
      const page = render(Component, baseProps);
      await expect.element(componentLocator(page)).toBeInTheDocument();
    });

    it("with icon", async () => {
      const page = render(Component, {
        ...baseProps,
        icon: createRawSnippet(() => ({
          render: () => '<span data-testid="test-icon">Test Icon</span>',
        })),
      });
      await expect.element(componentLocator(page)).toBeInTheDocument();
      await expect.element(page.getByTestId("test-icon")).toBeInTheDocument();
    });
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

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("helper");
      await expect.element(element).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });
  });
});
