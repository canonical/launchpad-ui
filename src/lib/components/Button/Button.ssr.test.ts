/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Button.svelte";

describe("Button SSR", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
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
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("button");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { style: "color: orange;", ...baseProps },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });

    it("applies type", () => {
      const page = render(Component, {
        props: { type: "submit", ...baseProps },
      });
      expect(componentLocator(page).getAttribute("type")).toBe("submit");
    });
  });

  describe("interactions", () => {
    it("renders as enabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).hasAttribute("disabled")).toBe(false);
    });

    it("renders disabled when props is set", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      expect(componentLocator(page).hasAttribute("disabled")).toBe(true);
    });

    it("renders disabled when in loading state", () => {
      const page = render(Component, {
        props: { ...baseProps, loading: true },
      });
      expect(componentLocator(page).hasAttribute("disabled")).toBe(true);
    });
  });

  describe("content", () => {
    it("renders children content", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children: createRawSnippet(() => ({
            render: () => "<span>Click me</span>",
          })),
        },
      });
      expect(componentLocator(page).textContent).toContain("Click me");
    });

    it("renders iconRight when provided", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          iconRight: createRawSnippet(() => ({
            render: () => "<span>Icon</span>",
          })),
        },
      });
      expect(page.getByText("Icon")).toBeDefined();
    });

    it("renders all content together", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          children: createRawSnippet(() => ({
            render: () => "<span>Click me</span>",
          })),
          iconLeft: createRawSnippet(() => ({
            render: () => "<span>Icon Left</span>",
          })),
          iconRight: createRawSnippet(() => ({
            render: () => "<span>Icon Right</span>",
          })),
        },
      });
      expect(componentLocator(page).textContent).toContain("Click me");
      expect(page.getByText("Icon Left")).toBeDefined();
      expect(page.getByText("Icon Right")).toBeDefined();
    });

    it("renders spinner when loading", () => {
      const page = render(Component, {
        props: { ...baseProps, loading: true },
      });
      expect(componentLocator(page).classList).toContain("loading");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("button");
}
