/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./HiddenEvents.svelte";

const baseProps = {
  numHidden: 888,
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the HiddenEvents component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("li");
}

describe("HiddenEvents SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLElement);
    expect(element?.tagName).toBe("LI");
    expect(page.container.innerHTML).toContain("888");
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, numHidden: 0, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          numHidden: 0,
          class: "test-class",
        },
      });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("hidden-events")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          numHidden: 0,
          style: "color: orange;",
        },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toBe("color: orange;");
    });
  });

  describe("Links", () => {
    it("renders show more", () => {
      const page = render(Component, {
        props: { ...baseProps, showMoreHref: "/show-more" },
      });
      expect(page.container.innerHTML).toContain("Show more");
      expect(page.container.innerHTML).toContain('href="/show-more"');
    });

    it("renders show all", () => {
      const page = render(Component, {
        props: { ...baseProps, showAllHref: "/show-all" },
      });
      expect(page.container.innerHTML).toContain("Show all");
      expect(page.container.innerHTML).toContain('href="/show-all"');
    });
  });
});
