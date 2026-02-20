import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./PageNavigation.svelte";

const { tableId } = vi.hoisted(() => ({
  tableId: "jobs-table",
}));

vi.mock("../../context.js", () => {
  return {
    getPaginationContext: () => ({ tableId }),
  };
});

describe("PageNavigation component", () => {
  const baseProps = {
    direction: "previous",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect
      .element(componentLocator(page))
      .toHaveAttribute("aria-label", "Go to previous page");
  });

  it("forwards pagination table id to aria-controls", async () => {
    const page = render(Component, { ...baseProps });
    await expect
      .element(componentLocator(page))
      .toHaveAttribute("aria-controls", tableId);
  });

  it.each([
    ["first", "Go to first page"],
    ["previous", "Go to previous page"],
    ["next", "Go to next page"],
    ["last", "Go to last page"],
  ] as const)(
    "maps %s direction to aria label",
    async (direction, expectedLabel) => {
      const page = render(Component, { direction });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute("aria-label", expectedLabel);
    },
  );

  it("renders an icon for the selected direction", async () => {
    const page = render(Component, { ...baseProps });
    const button = componentLocator(page).element() as HTMLButtonElement;
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("supports disabled state", async () => {
    const page = render(Component, { ...baseProps, disabled: true });
    await expect.element(componentLocator(page)).toBeDisabled();
  });

  it("calls onclick handler", async () => {
    const onclick = vi.fn();
    const page = render(Component, { ...baseProps, onclick });
    await componentLocator(page).click();
    expect(onclick).toHaveBeenCalledOnce();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "Custom page navigation"],
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
      await expect
        .element(componentLocator(page))
        .toHaveClass("pagination-page-navigation");
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
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button");
}
