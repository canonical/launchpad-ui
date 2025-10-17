/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./UserAvatar.svelte";

describe("UserAvatar component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    const element = componentLocator(page);
    expect(element).toBeDefined();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      expect(element?.classList.contains("test-class")).toBe(true);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("user-avatar")).toBe(true);
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toContain("color: orange;");
    });
  });

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

    it.each(sizeModifiers)("applies %s modifier", (size) => {
      const { container } = render(Component, {
        ...baseProps,
        modifiers: { size },
      });
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

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(
  page: RenderResult<typeof Component>,
): HTMLElement | null {
  return page.container.querySelector(".ds.user-avatar");
}
