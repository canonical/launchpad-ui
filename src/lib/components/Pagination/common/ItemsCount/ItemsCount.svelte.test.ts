import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ItemsCount.svelte";

describe("ItemsCount component", () => {
  const baseProps = {
    showing: 5,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect
      .element(componentLocator(page))
      .toHaveTextContent("Showing 5 items");
  });

  describe("text generation", () => {
    it("renders singular text without total", async () => {
      const page = render(Component, { showing: 1 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 1 item");
    });

    it("renders plural text without total", async () => {
      const page = render(Component, { showing: 2 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 2 items");
    });

    it("renders singular text with a singular total", async () => {
      const page = render(Component, { showing: 1, total: 1 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 1 of 1 item");
    });

    it("renders pluralized total text", async () => {
      const page = render(Component, { showing: 1, total: 2 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 1 of 2 items");
    });

    it("treats total=0 as not provided when showing is not zero", async () => {
      const page = render(Component, { showing: 4, total: 0 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 4 items");
    });

    it("treats total=0 as zero when showing is also zero", async () => {
      const page = render(Component, { showing: 0, total: 0 });
      await expect
        .element(componentLocator(page))
        .toHaveTextContent("Showing 0 of 0 items");
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "Items count"],
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
        .toHaveClass("pagination-items-count");
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
  return page.getByText(/^Showing /);
}
