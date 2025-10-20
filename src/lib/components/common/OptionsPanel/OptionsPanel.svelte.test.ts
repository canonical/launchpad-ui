/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./OptionsPanel.svelte";

describe("OptionsPanel component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("options-panel");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("Helper linking", () => {
    it("doesn't have aria-describedby by default", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(componentLocator(page))
        .not.toHaveAttribute("aria-describedby");
    });

    it("has aria-describedby properly linked to helper if it is present", async () => {
      const page = render(Component, {
        ...baseProps,
        helper: createRawSnippet<[string]>((id) => ({
          render: () => `<div id="${id()}">Test helper text</div>`,
        })),
      });

      await expect
        .element(componentLocator(page))
        .toHaveAccessibleDescription("Test helper text");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("options-panel");
}
