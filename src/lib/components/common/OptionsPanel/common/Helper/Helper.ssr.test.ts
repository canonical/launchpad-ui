/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Helper.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Helper text</span>",
}));

const baseProps = {
  children,
  id: "helper-id",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the Helper component element.
 * Uses testId as the component doesn't have a single semantic role.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("[data-testid='helper']");
}

describe("Helper SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("with required props", () => {
      const page = render(Component, {
        props: { ...baseProps },
      });
      const element = componentLocator(page);
      expect(element).toBeInstanceOf(page.window.HTMLElement);
      expect(element?.tagName).toBe("DIV");
    });

    it("with icon", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          icon: createRawSnippet(() => ({
            render: () => '<span data-testid="icon">Icon</span>',
          })),
        },
      });
      expect(page.container.innerHTML).toContain(
        '<span data-testid="icon">Icon</span>',
      );
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
      expect(element?.classList.contains("helper")).toBe(true);
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
});
