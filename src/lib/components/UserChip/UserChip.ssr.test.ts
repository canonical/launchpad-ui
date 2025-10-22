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
      const element = componentLocator(page);
      expect(element.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList).toContain("test-class");
      expect(element.classList).toContain("ds");
      expect(element.classList).toContain("user-chip");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      const element = componentLocator(page);
      expect(element.style.color).toBe("orange");
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
      expect(page.getByText("John Doe")).toBeInstanceOf(
        page.window.HTMLElement,
      );
    });

    it("with avatar by default", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
        },
      });
      expect(page.container.querySelector(".ds.user-avatar")).toBeInstanceOf(
        page.window.HTMLElement,
      );
    });

    it("with avatar when showAvatar is explicitly true", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          showAvatar: true,
        },
      });
      expect(page.container.querySelector(".ds.user-avatar")).toBeInstanceOf(
        page.window.HTMLElement,
      );
    });

    it("without avatar when showAvatar is false", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          showAvatar: false,
        },
      });
      expect(page.container.querySelector(".ds.user-avatar")).toBeNull();
    });

    it("applies modifiers", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
          modifiers: { size: "small" },
        },
      });
      const element = componentLocator(page);
      expect(element.classList).toContain("small");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("user-chip");
}
