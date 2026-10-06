import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Stat.svelte";
import {
  children,
  firstDescription,
  firstTerm,
  secondDescription,
  secondTerm,
} from "./test.fixtures.svelte";

describe("Stat component", () => {
  const baseProps = {
    children,
    "data-testid": "stat",
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("renders terms and descriptions in a description list", async () => {
      const page = await render(Component, { ...baseProps });
      const list = listLocator(page);
      await expect.element(list).toBeVisible();
      expect(list.element().tagName).toBe("DL");
      await expect.element(page.getByText(firstTerm)).toBeVisible();
      await expect.element(page.getByText(firstDescription)).toBeVisible();
      await expect.element(page.getByText(secondTerm)).toBeVisible();
      await expect.element(page.getByText(secondDescription)).toBeVisible();
      expect(
        Array.from(
          list.element().querySelectorAll("dt"),
          (term) => term.textContent,
        ),
      ).toEqual([firstTerm, secondTerm]);
      expect(
        Array.from(
          list.element().querySelectorAll("dd"),
          (description) => description.textContent,
        ),
      ).toEqual([firstDescription, secondDescription]);
    });

    it("renders without children", async () => {
      const page = await render(Component, { "data-testid": "stat" });
      await expect.element(listLocator(page)).toBeEmptyDOMElement();
    });
  });

  describe("attributes", () => {
    it("preserves the base class when a custom class is provided", async () => {
      const page = await render(Component, {
        ...baseProps,
        class: "custom-stat",
      });
      await expect
        .element(listLocator(page))
        .toHaveClass("stat", "custom-stat");
    });

    it("forwards HTML attributes to the description list", async () => {
      const page = await render(Component, {
        ...baseProps,
        id: "bug-stats",
        "aria-label": "Bug statistics",
      });
      const list = listLocator(page);
      await expect.element(list).toHaveAttribute("id", "bug-stats");
      await expect
        .element(list)
        .toHaveAttribute("aria-label", "Bug statistics");
    });

    it("forwards inline styles to the description list", async () => {
      const page = await render(Component, {
        ...baseProps,
        style: "margin-bottom: 24px;",
      });
      await expect
        .element(listLocator(page))
        .toHaveStyle("margin-bottom: 24px");
    });
  });
});

function listLocator(page: RenderResult<typeof Component>) {
  return page.getByTestId("stat");
}
