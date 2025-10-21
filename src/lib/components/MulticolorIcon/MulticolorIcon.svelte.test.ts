import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./MulticolorIcon.svelte";

describe("MulticolorIcon component", () => {
  const baseProps = { name: "error" } satisfies ComponentProps<
    typeof Component
  >;

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("basic attributes", () => {
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
      const page = render(Component, { ...baseProps, style: "color: red;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "red" });
    });

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("multicolor-icon");
      await expect.element(element).toHaveClass("test-class");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("multicolor-icon");
}
