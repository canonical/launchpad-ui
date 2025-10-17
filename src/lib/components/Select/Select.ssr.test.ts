/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { Snippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Select.svelte";
import type { SelectProps } from "./types";

describe("Select SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<option value="1">Option 1</option>`,
    })) as Snippet,
    multiple: false,
  } satisfies SelectProps;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
      },
    });
    expect(componentLocator(page)).toBeInstanceOf(
      page.window.HTMLSelectElement,
    );
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: {
          ...baseProps,
          [attribute]: expected,
        },
      });
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          class: "test-class",
        },
      });
      const wrapper = componentLocator(page)?.parentElement;
      expect(wrapper?.classList).toContain("test-class");
      expect(wrapper?.classList).toContain("ds");
      expect(wrapper?.classList).toContain("select");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          style: "color: orange;",
        },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("select");
}
