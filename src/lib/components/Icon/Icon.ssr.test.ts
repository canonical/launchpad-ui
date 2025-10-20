/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Icon.svelte";

describe("Icon SSR", () => {
  const baseProps = { name: "edit" } satisfies ComponentProps<typeof Component>;

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
      expect(componentLocator(page).getAttribute("style")).toContain(
        "color: red;",
      );
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const el = componentLocator(page);
      expect(el.classList.contains("ds")).toBe(true);
      expect(el.classList.contains("icon")).toBe(true);
      expect(el.classList.contains("test-class")).toBe(true);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("icon");
}
