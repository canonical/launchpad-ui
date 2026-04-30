import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Accordion.svelte";
import {
  itemAContentText,
  itemAHeadingText,
  itemBContentText,
  itemBHeadingText,
  twoItems,
} from "./test.fixtures.svelte";

describe("Accordion SSR", () => {
  const baseProps = {
    children: twoItems,
    "data-testid": "accordion-root",
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw without children", () => {
      expect(() => {
        render(Component, { props: {} });
      }).not.toThrow();
    });

    it("renders children", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.getByText(itemAHeadingText)).toBeDefined();
      expect(page.getByText(itemBHeadingText)).toBeDefined();
      expect(page.getByText(itemAContentText)).toBeDefined();
      expect(page.getByText(itemBContentText)).toBeDefined();
    });
  });

  describe("attributes", () => {
    it("uses a div as the root", () => {
      const page = render(Component, { props: { ...baseProps } });
      const root = componentLocator(page);
      expect(root).toBeInstanceOf(page.window.HTMLDivElement);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const root = componentLocator(page);
      expect(root.classList).toContain("ds");
      expect(root.classList).toContain("accordion");
      expect(root.classList).toContain("test-class");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });

    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("forwards %s to the root", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });
  });

  describe("exclusive mode", () => {
    it("does not give items a name attribute when exclusive is false", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(
        itemDetailsLocator(page, "item-a").getAttribute("name"),
      ).toBeNull();
      expect(
        itemDetailsLocator(page, "item-b").getAttribute("name"),
      ).toBeNull();
    });

    it("gives items a shared name attribute when exclusive is true", () => {
      const page = render(Component, {
        props: { ...baseProps, exclusive: true },
      });
      const nameA = itemDetailsLocator(page, "item-a").getAttribute("name");
      const nameB = itemDetailsLocator(page, "item-b").getAttribute("name");
      expect(nameA).toBeTruthy();
      expect(nameA).toBe(nameB);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("accordion-root");
}

function itemDetailsLocator(page: RenderResult, testId: string): HTMLElement {
  return page.getByTestId(testId);
}
