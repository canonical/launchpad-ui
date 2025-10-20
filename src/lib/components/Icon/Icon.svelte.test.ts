/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Icon.svelte";

describe("Icon component", () => {
  const baseProps = {
    name: "edit",
  } satisfies ComponentProps<typeof Component>;

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
  });

  it("applies classes", async () => {
    const page = render(Component, { ...baseProps, class: "test-class" });
    await expect.element(componentLocator(page)).toHaveClass("test-class");
    await expect.element(componentLocator(page)).toHaveClass("ds");
    await expect.element(componentLocator(page)).toHaveClass("icon");
  });

  it("applies style", async () => {
    const page = render(Component, {
      ...baseProps,
      style: "color: orange;",
    });
    await expect.element(componentLocator(page)).toHaveStyle("color: orange;");
  });

  it("renders icons with mask image", async () => {
    const page = render(Component, { name: "edit" });
    await expect
      .element(componentLocator(page))
      .toHaveStyle({ maskImage: "url(/icons/monotone/edit.svg)" });
  });

  it("renders icons with currentColor", async () => {
    const page = render(Component, {
      name: "edit",
      style: "color: blue;",
    });

    expect(componentLocator(page)).toHaveStyle({ backgroundColor: "blue" });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("icon");
}
