import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Tab.svelte";

describe("Tab SSR", () => {
  describe("basics", () => {
    const baseProps = {} satisfies ComponentProps<typeof Component>;

    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLLIElement);
    });
  });

  describe("attributes", () => {
    it.each([["id", "test-id"]])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: {
          [attribute]: expected,
        },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: {
          class: "test-class",
        },
      });
      const element = componentLocator(page);
      expect(element.classList).toContain("test-class");
      expect(element.classList).toContain("ds");
      expect(element.classList).toContain("tab");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: {
          style: "color: orange;",
        },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("base properties", () => {
    it("applies href", () => {
      const page = render(Component, { props: { href: "/test" } });
      const element = page.getByRole("link");
      expect(element.getAttribute("href")).toBe("/test");
    });

    it("applies aria-attributes", () => {
      const page = render(Component, {
        props: {
          "aria-disabled": "true",
          href: "/test",
        },
      });
      const element = page.getByRole("link");
      expect(element.getAttribute("aria-disabled")).toBe("true");
    });

    describe("active state", () => {
      it("is not active by default", () => {
        const page = render(Component, { props: { href: "/test" } });
        const listitem = componentLocator(page);
        const link = page.getByRole("link");

        expect(listitem.classList).not.toContain("active");
        expect(link.hasAttribute("aria-current")).toBe(false);
      });

      it("can be active", () => {
        const page = render(Component, {
          props: {
            active: true,
            href: "/test",
          },
        });

        const listitem = componentLocator(page);
        const link = page.getByRole("link");

        expect(listitem.classList).toContain("active");
        expect(link.getAttribute("aria-current")).toBe("page");
      });
    });
  });
});

function componentLocator(page: RenderResult): HTMLLIElement {
  return page.getByRole("listitem");
}
