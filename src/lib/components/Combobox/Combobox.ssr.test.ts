/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps, Snippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Combobox.svelte";

describe("Combobox SSR", () => {
  const baseProps = {
    search: createRawSnippet(() => ({
      render: () => `<input type="search" />`,
    })) as Snippet,
    inputsName: "options",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page)?.classList).toContain("test-class");
      expect(componentLocator(page)?.classList).toContain("ds");
      expect(componentLocator(page)?.classList).toContain("combobox");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("Renders", () => {
    it("search", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.container.innerHTML).toContain('<input type="search" />');
    });

    it("children", () => {
      const children = createRawSnippet(() => ({
        render: () => "<div>Option 1</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          children: children as Snippet,
        },
      });
      expect(page.container.innerHTML).toContain("Option 1");
    });

    it("footer", () => {
      const footer = createRawSnippet(() => ({
        render: () => "<div>Footer content</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          footer: footer as Snippet,
        },
      });
      expect(page.container.innerHTML).toContain("Footer content");
    });

    it("helper", () => {
      const helper = createRawSnippet(() => ({
        render: () => "<div>Helper content</div>",
      }));
      const page = render(Component, {
        props: {
          ...baseProps,
          helper: helper as Snippet,
        },
      });
      expect(page.container.innerHTML).toContain("Helper content");
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.container.innerHTML).not.toContain('role="listbox"');
    });

    it("doesn't apply aria-multiselectable", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.container.innerHTML).not.toContain("aria-multiselectable");
    });

    it("doesn't apply aria-busy", () => {
      const page = render(Component, {
        props: { ...baseProps, "aria-busy": true },
      });
      expect(page.container.innerHTML).not.toContain('aria-busy="true"');
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.getByTestId("combobox");
}
