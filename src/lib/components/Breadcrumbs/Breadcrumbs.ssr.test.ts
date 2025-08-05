/* @canonical/generator-ds 0.9.1-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Breadcrumbs.svelte";

describe("Breadcrumbs SSR", () => {
  const defaultSegments = [
    { label: "Home", href: "/" },
    { label: "Category", href: "/category" },
    { label: "Current Page" },
  ];

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { segments: defaultSegments } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, {
      props: { segments: defaultSegments },
    });
    expect(body).toContain("<nav");
    expect(body).toContain("</nav>");
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", segments: defaultSegments },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;", segments: defaultSegments },
      });
      expect(body).toMatch(/style="[^"]*color: red;[^"]*"/);
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class", segments: defaultSegments },
      });
      expect(body).toMatch(/class="[^"]*ds breadcrumbs[^"]*test-class[^"]*"/);
    });
  });

  describe("segments", () => {
    it("renders segments with links", () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
      ];
      const { body } = render(Component, { props: { segments } });
      expect(body).toContain('href="/"');
      expect(body).toContain('href="/products"');
      expect(body).toContain("Home");
      expect(body).toContain("Products");
    });

    it("renders segments without links", () => {
      const segments = [{ label: "Current Page" }];
      const { body } = render(Component, { props: { segments } });
      expect(body).toContain("<span>Current Page</span>");
    });

    it("marks last segment as current page", () => {
      const segments = [
        { label: "Home", href: "/" },
        { label: "Current", href: "/current" },
      ];
      const { body } = render(Component, { props: { segments } });
      expect(body).toContain('aria-current="page"');
    });
  });

  describe("collapse prop", () => {
    it.each(["all", 0, 1, 2] as const)(
      "renders with keepExpanded='%s'",
      (keepExpanded) => {
        const { body } = render(Component, {
          props: { segments: defaultSegments, keepExpanded },
        });
        expect(body).toContain("Home");
        expect(body).toContain("Category");
        expect(body).toContain("Current Page");
      },
    );
  });
});
