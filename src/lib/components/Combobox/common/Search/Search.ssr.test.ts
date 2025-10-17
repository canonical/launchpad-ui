/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Search.svelte";

describe("Search SSR", () => {
  const baseProps = {
    "aria-label": "Search",
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

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page)?.classList).toContain("test-class");
      expect(componentLocator(page)?.classList).toContain("ds");
      expect(componentLocator(page)?.classList).toContain("search");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)?.getAttribute("role")).toBeNull();
    });

    it("doesn't apply aria-controls", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)?.getAttribute("aria-controls")).toBeNull();
    });

    it("doesn't apply aria-autocomplete", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(
        componentLocator(page)?.getAttribute("aria-autocomplete"),
      ).toBeNull();
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("input");
}
