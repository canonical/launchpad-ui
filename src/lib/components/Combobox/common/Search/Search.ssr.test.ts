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
      expect(page.getByTestId("search-box").classList).toContain("test-class");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).getAttribute("role")).toBeNull();
    });

    it("doesn't apply aria-controls", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).getAttribute("aria-controls")).toBeNull();
    });

    it("doesn't apply aria-autocomplete", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(
        componentLocator(page).getAttribute("aria-autocomplete"),
      ).toBeNull();
    });
  });
});

function componentLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("searchbox");
}
