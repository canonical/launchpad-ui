/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./TitleRow.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Title Row Content</span>",
}));

const date = createRawSnippet(() => ({
  render: () => "<span>2023-03-15</span>",
}));

const baseProps = {
  children,
  date,
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the TitleRow component element.
 * Prefers semantic queries (e.g., querySelector with role) for better accessibility testing.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector('[data-testid="title-row"]');
}

describe("TitleRow SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLElement);
    expect(page.container.innerHTML).toContain("Title Row Content");
  });

  it("renders leadingText", () => {
    const page = render(Component, {
      props: { ...baseProps, leadingText: "Leading Text" },
    });
    expect(page.container.innerHTML).toContain("Leading Text");
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(value);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toContain("color: orange;");
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("title-row")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });
  });
});
