/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./UserChip.svelte";

describe("UserChip component", () => {
  const baseProps = {
    userName: "John Doe",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("user-chip");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("renders", () => {
    it("with userName", async () => {
      const page = render(Component, {
        ...baseProps,
        userName: "John Doe",
      });

      await expect.element(page.getByText("John Doe")).toBeInTheDocument();
    });

    it("with the avatar by default", async () => {
      const { container } = render(Component, {
        ...baseProps,
        userName: "John Doe",
      });

      expect(container.querySelector(".ds.user-avatar")).toBeInTheDocument();
    });

    it("with avatar when showAvatar is true", async () => {
      const { container } = render(Component, {
        ...baseProps,
        userName: "John Doe",
        showAvatar: true,
      });

      expect(container.querySelector(".ds.user-avatar")).toBeInTheDocument();
    });

    it("without avatar when showAvatar is false", async () => {
      const { container } = render(Component, {
        ...baseProps,
        userName: "John Doe",
        showAvatar: false,
      });

      expect(
        container.querySelector(".ds.user-avatar"),
      ).not.toBeInTheDocument();
    });
  });

  describe("modifiers", () => {
    const sizeModifiers = ["small", "large"] as const;

    it.each(sizeModifiers)("applies %s modifier", (size) => {
      const { container } = render(Component, {
        ...baseProps,
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

function componentLocator(page: RenderResult<typeof Component>) {
  return page.getByTestId("user-chip");
}
