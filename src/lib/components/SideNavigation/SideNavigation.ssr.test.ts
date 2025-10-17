/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./SideNavigation.svelte";
import { children, expandToggle, footer, logo } from "./test.fixtures.svelte";

const baseProps = {
  children,
  logo,
  expandToggle,
  footer,
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the SideNavigation component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("banner");
}

describe("SideNavigation SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeDefined();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(value);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).getAttribute("style")).toContain(
        "color: orange;",
      );
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("side-navigation")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });
  });

  describe("contents", () => {
    describe("while expanded", () => {
      it("renders logo", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: true },
        });

        const logo = await findByRole("link", { name: "Logo link" });
        expect(logo).toBeDefined();
      });

      it("renders children", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: true },
        });

        const navigation = await findByRole("navigation");
        expect(navigation).toBeDefined();

        const linkItem = await findByRole("link", { name: "Link in nav" });
        expect(linkItem).toBeDefined();

        const buttonItem = await findByRole("button", {
          name: "Button in nav",
        });
        expect(buttonItem).toBeDefined();
      });

      it("renders expand toggle", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: true },
        });

        const expandToggle = await findByRole("button", {
          name: "Collapse navigation",
        });
        expect(expandToggle).toBeDefined();
        expect(expandToggle.getAttribute("aria-expanded")).toBe("true");

        const navigation = await findByRole("navigation");
        expect(expandToggle.getAttribute("aria-controls")).toBe(navigation.id);
      });

      it("renders footer", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: true },
        });

        const linkItem = await findByRole("link", { name: "Link in footer" });
        expect(linkItem).toBeDefined();

        const buttonItem = await findByRole("button", {
          name: "Button in footer",
        });
        expect(buttonItem).toBeDefined();
      });
    });

    describe("while expanded", () => {
      it("renders logo", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: false },
        });

        const logo = await findByRole("link", { name: "Logo link" });
        expect(logo).toBeDefined();
      });

      it("doesn't render children", async () => {
        const { container } = render(Component, {
          props: { ...baseProps, expanded: false },
        });

        const navigation = container.querySelector("nav");
        expect(navigation).toBeNull();
      });

      it("renders expand toggle", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: false },
        });

        const expandToggle = await findByRole("button", {
          name: "Expand navigation",
        });
        expect(expandToggle).toBeDefined();
        expect(expandToggle.getAttribute("aria-expanded")).toBe("false");

        expect(expandToggle.getAttribute("aria-controls")).toBeTruthy();
      });

      it("renders footer", async () => {
        const { findByRole } = render(Component, {
          props: { ...baseProps, expanded: false },
        });

        const linkItem = await findByRole("link", { name: "Link in footer" });
        expect(linkItem).toBeDefined();

        const buttonItem = await findByRole("button", {
          name: "Button in footer",
        });
        expect(buttonItem).toBeDefined();
      });
    });
  });
});
