/* @canonical/generator-ds 0.9.0-experimental.22 */

import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./UserAvatar.svelte";

describe("UserAvatar component", () => {
  describe("renders", () => {
    it("with image when userAvatarUrl is provided", async () => {
      const { container } = render(Component, {
        userAvatarUrl: "https://example.com/avatar.png",
        userName: "John Doe",
      });

      const objectElement = container.querySelector("object[title='John Doe']");
      await expect.element(objectElement).toBeInTheDocument();
      await expect
        .element(objectElement)
        .toHaveAttribute("data", "https://example.com/avatar.png");
      await expect.element(objectElement).toHaveAttribute("type", "image/png");
    });

    it("initials when name is provided but no userAvatarUrl", async () => {
      const page = render(Component, { userName: "John Doe" });

      const abbrElement = page.getByTitle("John Doe");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("JD");
    });

    it("only first letter from single name", async () => {
      const page = render(Component, { userName: "John" });

      const abbrElement = page.getByTitle("John");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("J");
    });

    it("first letter from first two words of multi-word names", async () => {
      const page = render(Component, { userName: "John Jacob Smith" });

      const abbrElement = page.getByTitle("John Jacob Smith");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("JJ");
    });

    it("default icon when no user data is provided", async () => {
      const page = render(Component, {});

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });

    it("default icon when user object is empty", async () => {
      const page = render(Component);

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });

    it("default icon when user name is empty", async () => {
      const page = render(Component, { userName: "" });

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { container } = render(Component, {
        id: "test-id",
      });
      const icon = container.querySelector(".ds.user-avatar");
      expect(icon?.id).toBe("test-id");
    });

    it("applies style", () => {
      const { container } = render(Component, {
        style: "color: red;",
      });
      const icon = container.querySelector(".ds.user-avatar");
      expect(icon?.getAttribute("style")).toContain("color: red;");
    });

    it("applies class", () => {
      const { container } = render(Component, {
        class: "test-class",
      });
      const icon = container.querySelector(".ds.user-avatar");
      expect(icon?.classList.contains("test-class")).toBe(true);
    });
  });

  describe("modifiers", () => {
    const sizeModifiers = ["small", "large"] as const;

    it.each(sizeModifiers)("applies %s modifier", (size) => {
      const { container } = render(Component, { modifiers: { size } });
      const icon = container.querySelector(".ds.user-avatar");

      assert(icon !== null);
      expect(icon.classList.contains(size)).toBe(true);
      sizeModifiers.forEach((s) => {
        if (s !== size) {
          expect(icon.classList.contains(s)).toBe(false);
        }
      });
    });
  });
});
