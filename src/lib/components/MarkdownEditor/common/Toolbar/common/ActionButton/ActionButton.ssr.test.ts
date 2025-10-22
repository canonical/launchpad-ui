/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./ActionButton.svelte";

vi.mock("$lib/shortcuts/index.js", () => {
  return {
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts: vi.fn(),
  };
});

describe("Markdown Editor > Toolbar > ActionButton SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    })),
    label: "ActionButton",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(
      page.window.HTMLButtonElement,
    );
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
      expect(
        element.classList.contains("markdown-editor-toolbar-action-button"),
      ).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("disabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).getAttribute("disabled")).toBeDefined();
    });
  });
});

function componentLocator(page: RenderResult): HTMLButtonElement {
  return page.getByRole("button");
}
