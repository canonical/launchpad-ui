/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./OptionsGroup.svelte";

const baseProps = {} satisfies ComponentProps<typeof Component>;

/**
 * Returns the OptionsGroup component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("fieldset");
}

describe("Group SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("renders", () => {
    it("the fieldset", () => {
      const page = render(Component, { props: { ...baseProps } });
      const element = componentLocator(page);
      expect(element).toBeInstanceOf(page.window.HTMLElement);
      expect(element?.tagName).toBe("FIELDSET");
    });

    it("no legend by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.container.innerHTML).not.toContain("<legend");
    });

    it("the legend with group title", () => {
      const page = render(Component, {
        props: { ...baseProps, groupTitle: "Group Title" },
      });

      expect(page.container.innerHTML).toContain("<legend");
      expect(page.container.innerHTML).toContain("Group Title");
      expect(page.container.innerHTML).toContain("</legend>");
    });
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("options-group")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toBe("color: orange;");
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      const element = componentLocator(page);
      expect(element?.hasAttribute("disabled")).toBe(false);
    });

    it("can be disabled", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      const element = componentLocator(page);
      expect(element?.hasAttribute("disabled")).toBe(true);
    });
  });
});
