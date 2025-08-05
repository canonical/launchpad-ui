/* @canonical/generator-ds 0.9.1-experimental.0 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Breadcrumbs.svelte";

describe("Breadcrumbs component", () => {
  const segments = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    { label: "Subcategory", href: "/category/subcategory" },
    { label: "Current Page" },
  ];

  describe("basic rendering", () => {
    it("renders breadcrumbs navigation", async () => {
      const page = render(Component, { segments });
      await expect
        .element(page.getByRole("navigation", { name: "Breadcrumbs" }))
        .toBeInTheDocument();
      await expect.element(page.getByRole("list")).toBeInTheDocument();
    });

    it("renders all segments", async () => {
      const page = render(Component, { segments });
      for (const segment of segments) {
        if (segment.href) {
          await expect
            .element(
              page.getByRole("link", { name: segment.label, exact: true }),
            )
            .toBeInTheDocument();
        } else {
          await expect
            .element(page.getByText(segment.label))
            .toBeInTheDocument();
        }
      }
    });
  });

  describe("basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        id: "test-id",
        segments,
      });
      const nav = page.getByRole("navigation");
      await expect.element(nav).toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
        segments,
      });
      const nav = page.getByRole("navigation");
      await expect
        .element(nav)
        .toHaveAttribute("style", expect.stringContaining("color: red;"));
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
        segments,
      });
      const nav = page.getByRole("navigation");
      await expect.element(nav).toHaveClass("test-class");
      await expect.element(nav).toHaveClass("ds");
      await expect.element(nav).toHaveClass("breadcrumbs");
    });
  });

  describe("segments with links", () => {
    it("renders links for segments with href", async () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
      ];
      const page = render(Component, { segments });

      const homeLink = page.getByRole("link", { name: "Home" });
      const productsLink = page.getByRole("link", { name: "Products" });

      await expect.element(homeLink).toBeInTheDocument();
      await expect.element(homeLink).toHaveAttribute("href", "/");
      await expect.element(productsLink).toBeInTheDocument();
      await expect.element(productsLink).toHaveAttribute("href", "/products");
    });

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
    const segments = [
      { label: "Home", href: "/" },
      { label: "Level 1", href: "/level1" },
      { label: "Level 2", href: "/level1/level2" },
      { label: "Level 3", href: "/level1/level2/level3" },
      { label: "Level 4", href: "/level1/level2/level3/level4" },
      { label: "Current Page", href: "/level1/level2/level3/level4/current" },
    ];

    it("has all segments visible if no collapse is applied", async () => {
      const page = render(Component, {
        segments,
        minNumExpanded: "all",
      });

      for (const segment of segments) {
        await expect
          .element(page.getByRole("link", { name: segment.label }))
          .toBeVisible();
      }
    });

    it("properly collapses if width is insufficient", async () => {
      const page = render(Component, {
        segments,
        minNumExpanded: 0,
      });

      // Mock narrow container
      page.container.style.width = "100px";

      await expectAreCollapsed(page);

      // Make sure the hidden segments are not accessible and all links are in the document
      expect(page.getByRole("link").elements()).toHaveLength(segments.length);
      // Make sure that all of the segments are collapsed
      expect(
        collapsedLocator(page).getByRole("listitem").elements(),
      ).toHaveLength(segments.length);

      // Mock wider container
      page.container.style.width = "1000px";

      // Check that no segments are collapsed again
      await expectNoCollapsed(page);
      expect(page.getByRole("link").elements()).toHaveLength(segments.length);
    });

    it("properly works with the numeric collapse value", async () => {
      const minNumExpanded = 3;
      const page = render(Component, {
        segments,
        minNumExpanded,
      });

      // Mock narrow container
      page.container.style.width = "100px";

      // Check that maxNumCollapsed segments are collapsed
      await expectAreCollapsed(page);
      expect(
        collapsedLocator(page).getByRole("listitem").elements(),
      ).toHaveLength(segments.length - minNumExpanded);
    });

    describe("edge cases", () => {
      it("works properly when minNumExpanded is greater than segments count", async () => {
        const page = render(Component, {
          segments,
          minNumExpanded: 1000,
        });

        page.container.style.width = "100px";

        await expectNoCollapsed(page);
        expect(page.getByRole("link").elements()).toHaveLength(segments.length);
      });

      it("works properly when minNumExpanded is set to negative value", async () => {
        const page = render(Component, {
          segments,
          minNumExpanded: -1,
        });

        page.container.style.width = "100px";

        await expectAreCollapsed(page);
        expect(
          collapsedLocator(page).getByRole("listitem").elements(),
        ).toHaveLength(segments.length);
      });
    });
  });

  describe("accessibility", () => {
    describe("list structure", () => {
      it("uses proper flat list structure", async () => {
        const page = render(Component, { segments });

        await expect.element(page.getByRole("list")).toBeInTheDocument();
        expect(page.getByRole("listitem").elements()).toHaveLength(
          segments.length,
        );
      });

      it("uses proper flat list structure with collapsed segments", async () => {
        const page = render(Component, {
          segments,
          minNumExpanded: 1,
        });

        page.container.style.width = "100px";

        await expectAreCollapsed(page);
        expect(
          page.getByRole("list").getByRole("listitem").elements(),
        ).toHaveLength(segments.length);
      });
    });

    // `userEvent` functions doesn't seem to have an effect.
    // TODO: Find other way to implement focus management tests

    // describe("focus management", () => {
    //   it("allows focusing links with tab key", async () => {
    //     const page = render(Component, { segments });

    //     await userEvent.tab();
    //     const firstLink = page.getByRole("link", { name: "Home" });
    //     await expect.element(firstLink).toHaveFocus();

    //     await userEvent.tab();
    //     const secondLink = page.getByRole("link", {
    //       name: "Category",
    //       exact: true,
    //     });
    //     await expect.element(secondLink).toHaveFocus();
    //   });
    // });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collapsedLocator(page: RenderResult<any>) {
  return page.getByTestId("collapsed-segments");
}

// Utility functions to await for Svelte to settle the collapsed state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function expectAreCollapsed(page: RenderResult<any>) {
  await expect.element(collapsedLocator(page)).toBeInTheDocument();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function expectNoCollapsed(page: RenderResult<any>) {
  await expect.element(collapsedLocator(page)).not.toBeInTheDocument();
}
