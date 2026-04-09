/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./UserChip.svelte";

describe("UserChip SSR", () => {
  const baseProps = {
    userName: "John Doe",
    userAvatarUrl: "https://assets.ubuntu.com/v1/fca94c45-snap+icon.png",
    "data-testid": "user-chip",
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

  describe("avatar", () => {
    it("renders by default", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
        },
      });
      expect(avatarLocator(page)).not.toBeNull();
    });

    it("renders when showAvatar is true", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          showAvatar: true,
        },
      });
      expect(avatarLocator(page)).not.toBeNull();
    });

    it("doesn't render when showAvatar is false", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          showAvatar: false,
        },
      });
      expect(avatarLocator(page)).toBeNull();
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("user-chip");
}

function avatarLocator(page: RenderResult): HTMLElement | null {
  return page.queryByRole("img");
}
