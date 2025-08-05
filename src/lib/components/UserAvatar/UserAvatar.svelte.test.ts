/* @canonical/generator-ds 0.9.0-experimental.22 */

import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./UserAvatar.svelte";

describe("UserAvatar component", () => {
  describe("renders", () => {
    it("with image when imageUrl is provided", async () => {
      const user = {
        imageUrl: "https://example.com/avatar.png",
        name: "John Doe",
      };
      const { container } = render(Component, { user });

      const objectElement = container.querySelector("object[title='John Doe']");
      await expect.element(objectElement).toBeInTheDocument();
      await expect
        .element(objectElement)
        .toHaveAttribute("data", "https://example.com/avatar.png");
      await expect.element(objectElement).toHaveAttribute("type", "image/png");
    });

    it("initials when name is provided but no imageUrl", async () => {
      const user = { name: "John Doe" };
      const page = render(Component, { user });

      const abbrElement = page.getByTitle("John Doe");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("JD");
    });

    it("only first letter from single name", async () => {
      const user = { name: "John" };
      const page = render(Component, { user });

      const abbrElement = page.getByTitle("John");
      await expect.element(abbrElement).toBeInTheDocument();
      await expect.element(abbrElement).toHaveTextContent("J");
    });

    it("first letter from first two words of multi-word names", async () => {
      const user = { name: "John Jacob Smith" };
      const page = render(Component, { user });

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
      const user = {};
      const page = render(Component, { user });

      const iconElement = page.getByLabelText("User avatar");
      await expect.element(iconElement).toBeInTheDocument();
    });

    it("default icon when user name is empty", async () => {
      const user = { name: "" };
      const page = render(Component, { user });

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

  describe("size variations", () => {
    it("renders medium size by default", () => {
      const { container } = render(Component);
      const icon = container.querySelector(".ds.user-avatar");
      expect(icon?.classList.contains("size-medium")).toBe(true);
    });

    const sizes = ["small", "medium", "large"] as const;

    it.each(sizes)("renders %s size", (size) => {
      const { container } = render(Component, { size });
      const icon = container.querySelector(".ds.user-avatar");

      assert(icon !== null);
      expect(icon.classList.contains(`size-${size}`)).toBe(true);
      sizes.forEach((s) => {
        if (s !== size) {
          expect(icon.classList.contains(`size-${s}`)).toBe(false);
        }
      });
    });
  });
});
