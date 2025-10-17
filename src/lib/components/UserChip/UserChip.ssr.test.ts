/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./UserChip.svelte";

describe("UserChip SSR", () => {
  const baseProps = {
    userName: "John Doe",
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
      expect(componentLocator(page)?.classList).toContain("user-chip");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("renders", () => {
    it("with the user's name", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
        },
      });
      expect(page.container.innerHTML).toContain("<span>John Doe</span>");
    });

    it("with avatar by default", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
        },
      });
      expect(page.container.innerHTML).toContain("user-avatar");
    });

    it("with avatar when showAvatar is explicitly true", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          showAvatar: true,
        },
      });
      expect(page.container.innerHTML).toContain("user-avatar");
    });

    it("without avatar when showAvatar is false", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          showAvatar: false,
        },
      });
      expect(page.container.innerHTML).not.toContain("user-avatar");
    });

    it("applies custom class", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          class: "test-class",
        },
      });
      expect(page.container.innerHTML).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies modifiers", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          modifiers: { size: "small" },
        },
      });
      expect(page.container.innerHTML).toMatch(/class="[^"]*small[^"]*"/);
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector(".ds.user-chip");
}
