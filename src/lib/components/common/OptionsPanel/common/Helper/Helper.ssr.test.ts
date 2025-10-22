/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Helper.svelte";

describe("Helper SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => "<span>Helper text</span>",
    })),
    id: "helper-id",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("with required props", () => {
      const page = render(Component, {
        props: { ...baseProps },
      });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLDivElement);
    });

    it("with icon", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          icon: createRawSnippet(() => ({
            render: () => '<span data-testid="icon">Icon</span>',
          })),
        },
      });
      expect(page.getByTestId("icon")).toBeTruthy();
    });
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
      expect(element.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("options-panel-helper")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).getAttribute("style")).toBe(
        "color: orange;",
      );
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("helper");
}
