/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Event.svelte";

const children = createRawSnippet(() => ({
  render: () => "Child Content",
}));

const titleRow = createRawSnippet(() => ({
  render: () => "Title Row Content",
}));

const baseProps = {} satisfies ComponentProps<typeof Component>;

/**
 * Returns the Event component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("li");
}

describe("Event SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("list item", () => {
      const page = render(Component, { props: { ...baseProps } });
      const element = componentLocator(page);
      expect(element).toBeInstanceOf(page.window.HTMLElement);
      expect(element?.tagName).toBe("LI");
    });

    it("with children", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children,
        },
      });
      expect(page.container.innerHTML).toContain("Child Content");
    });

    it("with title row", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          titleRow,
        },
      });
      expect(page.container.innerHTML).toContain("Title Row Content");
    });

    describe("Marker", () => {
      it("empty", () => {
        const page = render(Component, { props: { ...baseProps } });
        expect(page.container.innerHTML).toContain("marker");
        expect(page.container.innerHTML).toContain("marker-empty");
      });

      it("small", () => {
        const page = render(Component, {
          props: {
            ...baseProps,
            markerSize: "small",
            marker: "flag",
          },
        });
        expect(page.container.innerHTML).toContain("marker-small");
      });

      it("large", () => {
        const page = render(Component, {
          props: {
            ...baseProps,
            markerSize: "large",
            marker: "flag",
          },
        });
        expect(page.container.innerHTML).toContain("marker-large");
      });
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
        props: {
          ...baseProps,
          class: "test-class",
        },
      });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("event")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          style: "color: orange;",
        },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toBe("color: orange;");
    });
  });
});
