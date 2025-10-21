import { render } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./UserAvatar.svelte";

describe("UserAvatar SSR", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.getByTestId("user-avatar")).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
    });
  });

  describe("renders", () => {
    it("with default icon when no user data is provided", () => {
      const page = render(Component, { props: { ...baseProps } });
      const element = page.getByTestId("user-avatar");
      expect(element.classList).toContain("ds");
      expect(element.classList).toContain("user-avatar");
    });

    it("with image when userAvatarUrl is provided", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userAvatarUrl: "https://example.com/avatar.png",
          userName: "John Doe",
        },
      });
      const element = page.getByRole("img", { name: "John Doe" });
      expect(element).toBeInstanceOf(page.window.HTMLObjectElement);
      expect(element.getAttribute("data")).toBe(
        "https://example.com/avatar.png",
      );
      expect(element.getAttribute("title")).toBe("John Doe");
      expect(element.getAttribute("type")).toBe("image/png");
    });

    it("with image when userAvatarUrl is provided but no userName", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userAvatarUrl: "https://example.com/avatar.png",
        },
      });
      const element = page.getByRole("img", { name: "User avatar" });
      expect(element).toBeInstanceOf(page.window.HTMLObjectElement);
      expect(element.getAttribute("data")).toBe(
        "https://example.com/avatar.png",
      );
    });

    it("initials when name is provided but no userAvatarUrl", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          userName: "John Doe",
        },
      });
      const element = page.getByTestId("user-avatar");
      const abbr = element.querySelector("abbr");
      expect(abbr?.getAttribute("title")).toBe("John Doe");
      expect(abbr?.textContent).toBe("JD");
    });
  });
});
