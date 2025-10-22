/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { page as pageContext, userEvent } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Breadcrumbs.svelte";

describe("Breadcrumbs component", () => {
  const baseProps = {
    segments: [
      { label: "Home", href: "/" },
      { label: "Category", href: "/category" },
      { label: "Subcategory", href: "/category/subcategory" },
      { label: "Current Page" },
    ],
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
      const page = render(Component, {
        ...baseProps,
        [attribute]: expected,
      });
      await expect
        .element(page.getByRole("navigation"))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, {
        ...baseProps,
        class: "test-class",
      });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("breadcrumbs");
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

  describe("basic rendering", () => {
    it("renders breadcrumbs navigation", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(page.getByRole("navigation", { name: "Breadcrumbs" }))
        .toBeInTheDocument();
      await expect.element(page.getByRole("list")).toBeInTheDocument();
    });

    it("renders all segments", async () => {
      const page = render(Component, { ...baseProps });
      for (const segment of baseProps.segments) {
        if (segment.href) {
          const linkElement = page.getByRole("link", {
            name: segment.label,
            exact: true,
          });
          await expect.element(linkElement).toBeInTheDocument();
          await expect
            .element(linkElement)
            .toHaveAttribute("href", segment.href);
        } else {
          await expect
            .element(page.getByText(segment.label))
            .toBeInTheDocument();
        }
      }
    });
  });

  describe("basic attributes", () => {
    it("marks last linked segment as current page", async () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Category", href: "/category" },
        { label: "Current", href: "/current" },
      ];
      const page = render(Component, { segments });

      await expect
        .element(page.getByRole("link", { name: "Home" }))
        .not.toHaveAttribute("aria-current");
      await expect
        .element(page.getByRole("link", { name: "Category" }))
        .not.toHaveAttribute("aria-current");
      await expect
        .element(page.getByRole("link", { name: "Current" }))
        .toHaveAttribute("aria-current", "page");
    });
  });

  describe("collapse mechanism", () => {
    const baseProps = {
      segments: [
        { label: "Home", href: "/" },
        { label: "Level 1", href: "/level1" },
        { label: "Level 2", href: "/level1/level2" },
        { label: "Level 3", href: "/level1/level2/level3" },
        { label: "Level 4", href: "/level1/level2/level3/level4" },
        { label: "Current Page", href: "/level1/level2/level3/level4/current" },
      ],
    };

    it("has all segments visible if no collapse is applied", async () => {
      const page = render(Component, {
        ...baseProps,
        minNumExpanded: "all",
      });

      for (const segment of baseProps.segments) {
        await expect
          .element(page.getByRole("link", { name: segment.label }))
          .toBeVisible();
      }
    });

    it("properly collapses if width is insufficient", async () => {
      const page = render(Component, {
        ...baseProps,
        minNumExpanded: 0,
      });

      // Mock narrow container
      pageContext.viewport(100, 800);

      await expectAreCollapsed(page);

      // Make sure the hidden segments are not accessible and all links are in the document
      expect(page.getByRole("link").elements()).toHaveLength(
        baseProps.segments.length,
      );
      // Make sure that all of the segments are collapsed
      expect(
        collapsedLocator(page).getByRole("listitem").elements(),
      ).toHaveLength(baseProps.segments.length);

      // Expand the container
      pageContext.viewport(1000, 800);

      // Check that no segments are collapsed again
      await expectNoCollapsed(page);
      expect(page.getByRole("link").elements()).toHaveLength(
        baseProps.segments.length,
      );
    });

    it("properly works with the numeric collapse value", async () => {
      const minNumExpanded = 3;
      const page = render(Component, {
        ...baseProps,
        minNumExpanded,
      });

      // Mock narrow container
      pageContext.viewport(100, 800);

      // Check that maxNumCollapsed segments are collapsed
      await expectAreCollapsed(page);
      expect(
        collapsedLocator(page).getByRole("listitem").elements(),
      ).toHaveLength(baseProps.segments.length - minNumExpanded);
    });

    describe("edge cases", () => {
      it("works properly when minNumExpanded is greater than segments count", async () => {
        const page = render(Component, {
          ...baseProps,
          minNumExpanded: 1000,
        });

        pageContext.viewport(100, 800);

        await expectNoCollapsed(page);
        expect(page.getByRole("link").elements()).toHaveLength(
          baseProps.segments.length,
        );
      });

      it("works properly when minNumExpanded is set to negative value", async () => {
        const page = render(Component, {
          ...baseProps,
          minNumExpanded: -1,
        });

        pageContext.viewport(100, 800);

        await expectAreCollapsed(page);
        expect(
          collapsedLocator(page).getByRole("listitem").elements(),
        ).toHaveLength(baseProps.segments.length);
      });
    });
  });

  describe("accessibility", () => {
    describe("list structure", () => {
      it("uses proper flat list structure", async () => {
        const page = render(Component, { ...baseProps });

        await expect.element(page.getByRole("list")).toBeInTheDocument();
        expect(page.getByRole("listitem").elements()).toHaveLength(
          baseProps.segments.length,
        );
      });

      it("uses proper flat list structure with collapsed segments", async () => {
        const segments = [
          { label: "Home", href: "/" },
          { label: "Level 1", href: "/level1" },
          { label: "Level 2", href: "/level1/level2" },
          { label: "Level 3", href: "/level1/level2/level3" },
          { label: "Level 4", href: "/level1/level2/level3/level4" },
          {
            label: "Current Page",
            href: "/level1/level2/level3/level4/current",
          },
        ];
        const page = render(Component, {
          segments,
          minNumExpanded: 1,
        });

        pageContext.viewport(100, 800);

        await expectAreCollapsed(page);
        expect(
          page.getByRole("list").getByRole("listitem").elements(),
        ).toHaveLength(segments.length);
      });
    });

    describe("focus management", () => {
      it("allows focusing links with tab key", async () => {
        const page = render(Component, { ...baseProps });

        const firstLink = page.getByRole("link", { name: "Home" });
        await expect.element(firstLink).toBeVisible();
        await userEvent.click(page.baseElement);

        await userEvent.tab();
        await expect.element(firstLink).toHaveFocus();
        await userEvent.tab();
        await expect
          .element(
            page.getByRole("link", {
              name: "Category",
              exact: true,
            }),
          )
          .toHaveFocus();
      });

      it("allows focusing links with tab key when segments are collapsed", async () => {
        const page = render(Component, {
          ...baseProps,
          minNumExpanded: 2,
        });

        pageContext.viewport(100, 800);

        await expectAreCollapsed(page);

        const firstLink = page.getByRole("link", { name: "Home" });
        await expect.element(firstLink).toBeInTheDocument();
        await userEvent.click(page.baseElement);

        await userEvent.tab();
        await expect.element(firstLink).toHaveFocus();
        await userEvent.tab();
        await expect
          .element(
            page.getByRole("link", {
              name: "Category",
              exact: true,
            }),
          )
          .toHaveFocus();
        await userEvent.tab();
        await expect
          .element(
            page.getByRole("link", {
              name: "Subcategory",
            }),
          )
          .toHaveFocus();
      });
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("navigation", { name: "Breadcrumbs" });
}

function collapsedLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("collapsed-segments");
}

// Utility functions to await for Svelte to settle the collapsed state
async function expectAreCollapsed(page: RenderResult<typeof Component>) {
  await expect.element(collapsedLocator(page)).toBeInTheDocument();
}

async function expectNoCollapsed(page: RenderResult<typeof Component>) {
  await expect.element(collapsedLocator(page)).not.toBeInTheDocument();
}
