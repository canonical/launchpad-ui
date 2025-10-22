/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Breadcrumbs.svelte";

describe("Breadcrumbs SSR", () => {
  const baseProps = {
    segments: [
      { label: "Home", href: "/" },
      { label: "Category", href: "/category" },
      { label: "Current Page" },
    ],
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, {
        props: { ...baseProps },
      });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLElement);
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("breadcrumbs");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("segments", () => {
    it("renders segments with links", () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
      ];
      const page = render(Component, { props: { segments } });

      expect(page.getAllByRole("link").length).toBe(2);
      expect(page.getByText("Home").getAttribute("href")).toBe("/");
      expect(page.getByText("Products").getAttribute("href")).toBe("/products");
    });

    it("renders segments without links", () => {
      const segments = [{ label: "Current Page" }];
      const page = render(Component, { props: { segments } });
      expect(page.getByText("Current Page")).toBeDefined();
      expect(page.getByText("Current Page")).not.toBeInstanceOf(
        page.window.HTMLAnchorElement,
      );
    });

    it("marks last segment as current page", () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Current", href: "/current" },
      ];
      const page = render(Component, { props: { segments } });
      expect(
        page
          .getByRole("link", { name: "Current" })
          .getAttribute("aria-current"),
      ).toBe("page");
    });
  });

  describe("collapse prop", () => {
    it.each(["all", 0, 1, 2] as const)(
      "renders with minNumExpanded='%s'",
      (minNumExpanded) => {
        const page = render(Component, {
          props: { ...baseProps, minNumExpanded },
        });
        expect(page.getAllByRole("listitem").length).toBe(3);
      },
    );
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("navigation");
}
