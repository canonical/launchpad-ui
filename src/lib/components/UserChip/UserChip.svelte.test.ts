/* @canonical/generator-ds 0.9.1-experimental.0 */

import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./UserChip.svelte";

describe("UserChip component", () => {
  describe("renders", () => {
    it("with userName", async () => {
      const page = render(Component, {
        userName: "John Doe",
      });

      await expect.element(page.getByText("John Doe")).toBeInTheDocument();
    });

    it("with the avatar by default", async () => {
      const { container } = render(Component, {
        userName: "John Doe",
      });

      expect(container.querySelector(".ds.user-avatar")).toBeInTheDocument();
    });

    it("with avatar when showAvatar is true", async () => {
      const { container } = render(Component, {
        userName: "John Doe",
        showAvatar: true,
      });

      expect(container.querySelector(".ds.user-avatar")).toBeInTheDocument();
    });

    it("without avatar when showAvatar is false", async () => {
      const { container } = render(Component, {
        userName: "John Doe",
        showAvatar: false,
      });

      expect(
        container.querySelector(".ds.user-avatar"),
      ).not.toBeInTheDocument();
    });
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { container } = render(Component, {
        userName: "John Doe",
        id: "test-id",
      });
      const chip = container.querySelector(".ds.user-chip");
      expect(chip?.id).toBe("test-id");
    });

    it("applies style", () => {
      const { container } = render(Component, {
        userName: "John Doe",
        style: "color: red;",
      });
      const chip = container.querySelector(".ds.user-chip");
      expect(chip?.getAttribute("style")).toContain("color: red;");
    });

    it("applies class", () => {
      const { container } = render(Component, {
        userName: "John Doe",
        class: "test-class",
      });
      const chip = container.querySelector(".ds.user-chip");
      expect(chip?.classList.contains("test-class")).toBe(true);
    });
  });

  describe("modifiers", () => {
    const sizeModifiers = ["small", "large"] as const;

    it.each(sizeModifiers)("applies %s modifier", (size) => {
      const { container } = render(Component, {
        userName: "John Doe",
        modifiers: { size },
      });
      const chip = container.querySelector(".ds.user-chip");

      assert(chip !== null);
      expect(chip.classList.contains(size)).toBe(true);
      sizeModifiers.forEach((s) => {
        if (s !== size) {
          expect(chip.classList.contains(s)).toBe(false);
        }
      });
    });
  });
});
