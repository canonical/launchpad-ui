/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./SearchBox.svelte";

describe("SearchBox SSR", () => {
  const baseProps = {
    "aria-label": "Search articles",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLDivElement);
    expect(inputLocator(page)).toBeInstanceOf(page.window.HTMLInputElement);
    expect(buttonLocator(page)).toBeInstanceOf(page.window.HTMLButtonElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s to wrapper", (attribute, expected) => {
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
      expect(componentLocator(page)?.classList).toContain("search-box");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("input attributes", () => {
    it.each([
      ["name", "test-name"],
      ["value", "test-value"],
      ["placeholder", "test-placeholder"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(inputLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { style: "color: orange;", ...baseProps },
      });
      expect(inputLocator(page).style.color).toBe("orange");
    });
  });

  describe("button and input", () => {
    it("are not disabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(inputLocator(page).disabled).toBe(false);
      expect(buttonLocator(page).disabled).toBe(false);
    });

    it("can be disabled", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      expect(inputLocator(page).disabled).toBe(true);
      expect(buttonLocator(page).disabled).toBe(true);
    });

    it("share the same accessible name", () => {
      const label = "test-label";
      const page = render(Component, {
        props: { ...baseProps, "aria-label": label },
      });
      expect(page.getByRole("searchbox", { name: label })).toBeDefined();
      expect(page.getByRole("button", { name: label })).toBeDefined();
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.getByTestId("search-box");
}

function inputLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("searchbox", { name: "Search articles" });
}

function buttonLocator(page: RenderResult): HTMLButtonElement {
  return page.getByRole("button", { name: "Search articles" });
}
