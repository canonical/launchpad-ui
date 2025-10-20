/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./MulticolorIcon.svelte";

describe("MulticolorIcon SSR", () => {
  const baseProps = { name: "error" } satisfies ComponentProps<
    typeof Component
  >;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
    });
  });

  describe("basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(value);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: red;" },
      });
      expect(componentLocator(page).style.color).toBe("red");
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const el = componentLocator(page);
      expect(el.classList.contains("ds")).toBe(true);
      expect(el.classList.contains("multicolor-icon")).toBe(true);
      expect(el.classList.contains("test-class")).toBe(true);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("multicolor-icon");
}
