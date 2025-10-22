/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Combobox.svelte";

describe("Combobox SSR", () => {
  const baseProps = {
    search: createRawSnippet(() => ({
      render: () => `<input type="search" data-testid="search-input" />`,
    })),
    inputsName: "options",
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
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
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Renders", () => {
    it("search", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.getByTestId("search-input")).toBeTruthy();
    });

    it("children", () => {
      const children = createRawSnippet(() => ({
        render: () => "<div>Option 1</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          children,
        },
      });
      expect(componentLocator(page).textContent).toContain("Option 1");
    });

    it("footer", () => {
      const footer = createRawSnippet(() => ({
        render: () => "<div>Footer content</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          footer,
        },
      });
      expect(componentLocator(page).textContent).toContain("Footer content");
    });

    it("helper", () => {
      const helper = createRawSnippet(() => ({
        render: () => "<div>Helper content</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          helper,
        },
      });
      expect(componentLocator(page).textContent).toContain("Helper content");
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("role")).toBe(false);
    });

    it("doesn't apply aria-multiselectable", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("aria-multiselectable")).toBe(
        false,
      );
    });

    it("doesn't apply aria-busy", () => {
      const page = render(Component, {
        props: { ...baseProps, "aria-busy": true },
      });
      expect(componentLocator(page).hasAttribute("aria-busy")).toBe(false);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("combobox");
}
