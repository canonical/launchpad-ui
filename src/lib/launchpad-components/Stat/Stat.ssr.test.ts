import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Stat.svelte";
import {
  children,
  childrenWithItemAttributes,
  firstDescription,
  firstTerm,
  secondDescription,
  secondTerm,
} from "./test.fixtures.svelte";

describe("Stat SSR", () => {
  const baseProps = {
    children,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders terms and descriptions in a description list", () => {
      const page = render(Component, { props: { ...baseProps } });
      const list = listLocator(page);
      expect(list).not.toBeNull();
      expect(
        Array.from(list.querySelectorAll("dt"), (term) => term.textContent),
      ).toEqual([firstTerm, secondTerm]);
      expect(
        Array.from(
          list.querySelectorAll("dd"),
          (description) => description.textContent,
        ),
      ).toEqual([firstDescription, secondDescription]);
    });

    it("renders without children", () => {
      const page = render(Component, { props: {} });
      expect(listLocator(page).children.length).toBe(0);
    });

    it("renders an aria-hidden dot for a marked item", () => {
      const page = render(Component, { props: { ...baseProps } });
      const dot = listLocator(page).querySelector(".stat-dot");

      expect(dot).not.toBeNull();
      expect(dot?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("attributes", () => {
    it("preserves the base class when a custom class is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "custom-stat" },
      });
      const list = listLocator(page);
      expect(list.classList.contains("stat")).toBe(true);
      expect(list.classList.contains("custom-stat")).toBe(true);
    });

    it("forwards HTML attributes to the description list", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          id: "bug-stats",
          "aria-label": "Bug statistics",
        },
      });
      const list = listLocator(page);
      expect(list.getAttribute("id")).toBe("bug-stats");
      expect(list.getAttribute("aria-label")).toBe("Bug statistics");
    });

    it("forwards inline styles to the description list", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "margin-bottom: 24px;" },
      });
      expect(listLocator(page).getAttribute("style")).toBe(
        "margin-bottom: 24px;",
      );
    });

    it("forwards Item classes and attributes only to its outer div", () => {
      const page = render(Component, {
        props: { children: childrenWithItemAttributes },
      });

      const item = listLocator(page).querySelector(".stat-item");
      expect(item).toBeTruthy();
      expect(item?.classList.contains("custom-item")).toBe(true);
      expect(item?.getAttribute("id")).toBe("bug-count");
      expect(item?.getAttribute("aria-label")).toBe("Bug count");

      for (const selector of ["dt", "dd"]) {
        const child = item?.querySelector(selector);
        expect(child).not.toBeNull();
        expect(child?.classList.contains("custom-item")).toBe(false);
        expect(child?.hasAttribute("id")).toBe(false);
        expect(child?.hasAttribute("aria-label")).toBe(false);
      }
    });
  });
});

function listLocator(page: RenderResult): HTMLElement {
  return page.document.querySelector("dl");
}
