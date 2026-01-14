/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Helper.svelte";

describe("Helper component", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => "<span>Helper text</span>",
    })),
    id: "helper-id",
  } satisfies ComponentProps<typeof Component>;

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
      await expect.element(element).toHaveClass("options-panel-helper");
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

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("helper");
}
