/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./LinkOption.svelte";

const baseProps = {
  text: "Text",
  href: "#",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the LinkOption component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("a");
}

describe("LinkOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLElement);
    expect(element?.tagName).toBe("A");
    expect(element?.getAttribute("href")).toBe("#");
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
      expect(element?.classList.contains("link-option")).toBe(true);
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
      const page = render(Component, {
        props: { ...baseProps },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("aria-disabled")).not.toBe("true");
      expect(element?.getAttribute("href")).toBe("#");
    });

    it("can be disabled (removes href)", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      const element = componentLocator(page);
      // href should be removed when disabled
      expect(element?.hasAttribute("href")).toBe(false);
      expect(element?.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = render(Component, {
        props: { ...baseProps, text: "Main Text" },
      });
      expect(page.container.innerHTML).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          text: "Main Text",
          secondaryText: "Secondary Text",
        },
      });
      expect(page.container.innerHTML).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          text: "Main Text",
          trailingText: "Trailing Text",
        },
      });
      expect(page.container.innerHTML).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          text: "Main Text",
          icon: createRawSnippet(() => ({
            render: () => `<span class="text-icon-class"></span>`,
          })),
        },
      });
      expect(page.container.innerHTML).toContain('class="text-icon-class"');
    });
  });
});
