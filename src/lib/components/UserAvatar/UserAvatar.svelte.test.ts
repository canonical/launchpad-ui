/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./UserAvatar.svelte";

describe("UserAvatar component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("renders", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(page.getByTestId("user-avatar")).toBeInTheDocument();
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(page.getByTestId("user-avatar"))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = page.getByTestId("user-avatar");
      await expect.element(element).toHaveClass("test-class");
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("user-avatar");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(page.getByTestId("user-avatar"))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("renders", () => {
    it("with image when userAvatarUrl is provided", async () => {
      const page = render(Component, {
        ...baseProps,
        userAvatarUrl: "https://example.com/avatar.png",
        userName: "John Doe",
      });

      const element = page.getByRole("img", { name: "John Doe" });
      await expect.element(element).toBeInTheDocument();
      await expect
        .element(element)
        .toHaveAttribute("data", "https://example.com/avatar.png");
      await expect.element(element).toHaveAttribute("type", "image/png");
    });

    it("with image when userAvatarUrl is provided but no userName", async () => {
      const page = render(Component, {
        ...baseProps,
        userAvatarUrl: "https://example.com/avatar.png",
      });

      const element = page.getByRole("img", { name: "User avatar" });
      await expect.element(element).toBeInTheDocument();
      await expect
        .element(element)
        .toHaveAttribute("data", "https://example.com/avatar.png");
    });

    it("initials when name is provided but no userAvatarUrl", async () => {
      const page = render(Component, { ...baseProps, userName: "John Doe" });

      const abbrElement = page.getByTitle("John Doe");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("JD");
    });

    it("only first letter from single name", async () => {
      const page = render(Component, { ...baseProps, userName: "John" });

      const abbrElement = page.getByTitle("John");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("J");
    });

    it("first letter from first two words of multi-word names", async () => {
      const page = render(Component, {
        ...baseProps,
        userName: "John Jacob Smith",
      });

      const abbrElement = page.getByTitle("John Jacob Smith");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("JJ");
    });

    it("default icon when no user data is provided", async () => {
      const page = render(Component, { ...baseProps });

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });

    it("default icon when user object is empty", async () => {
      const page = render(Component, { ...baseProps });

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });

    it("default icon when user name is empty", async () => {
      const page = render(Component, { ...baseProps, userName: "" });

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });
  });

  describe("modifiers", () => {
    const sizeModifiers = ["small", "large"] as const;

    it.each(sizeModifiers)("applies %s modifier", async (size) => {
      const page = render(Component, {
        ...baseProps,
        size,
      });
      const element = page.getByTestId("user-avatar");
      const classList = element.element().classList;

      expect(classList.contains(size)).toBe(true);
      sizeModifiers.forEach((s) => {
        if (s !== size) {
          expect(classList.contains(s)).toBe(false);
        }
      });
    });
  });
});
