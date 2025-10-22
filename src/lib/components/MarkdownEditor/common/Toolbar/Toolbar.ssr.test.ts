/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./Toolbar.svelte";

vi.mock("$lib/shortcuts/index.js", async (importActual) => {
  const actual = await importActual<typeof import("$lib/shortcuts/index.js")>();
  const useShortcuts = () => () => [];
  return {
    ...actual,
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts,
  };
});

describe("Markdown Editor > Toolbar SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>Toolbar</span>`,
    })),
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLDivElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element.getAttribute(attribute)).toBe(value);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      const element = componentLocator(page);
      expect(element.getAttribute("style")).toContain("color: orange;");
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("markdown-editor-toolbar")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("toolbar");
}
