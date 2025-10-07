/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./SideNavigation.svelte";
import { children, expandToggle, footer, logo } from "./test.fixtures.svelte";
import type { SideNavigationProps } from "./types.js";

describe("SideNavigation SSR", () => {
  const baseProps = {
    children,
    logo,
    expandToggle,
    footer,
  } satisfies SideNavigationProps;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const { getByRole } = render(Component, {
        props: { ...baseProps },
      });
      expect(getByRole("banner")).toBeDefined();
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["style", "color: orange;"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const { getByRole } = render(Component, {
        props: { [attribute]: expected, ...baseProps },
      });
      expect(getByRole("banner").getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const { getByRole } = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      const classes = ["test-class"];
      classes.push("ds", "side-navigation");

      for (const className of classes) {
        expect(getByRole("banner").classList).toContain(className);
      }
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
