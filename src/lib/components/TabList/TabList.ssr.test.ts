import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./TabList.svelte";

describe("TabList SSR", () => {
  describe("basics", () => {
    const baseProps = {
      children: createRawSnippet(() => ({
        render: () => `<span>TabList</span>`,
      })),
    } satisfies ComponentProps<typeof Component>;

    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLElement);
    });
  });

  describe("attributes", () => {
    const baseProps = {
      children: createRawSnippet(() => ({
        render: () => `<span>TabList</span>`,
      })),
    } satisfies ComponentProps<typeof Component>;

    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: {
          ...baseProps,
          [attribute]: expected,
        },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          class: "test-class",
        },
      });
      const element = componentLocator(page);
      expect(element.classList).toContain("test-class");
      expect(element.classList).toContain("ds");
      expect(element.classList).toContain("tab-list");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          style: "color: orange;",
        },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("navigation");
}
