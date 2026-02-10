/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./RadioOption.svelte";

describe("RadioOption SSR", () => {
  const baseProps = {
    text: "Text",
  } satisfies ComponentProps<typeof Component>;
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLLabelElement);
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("radio-option")).toBe(true);
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

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(radioLocator(page).hasAttribute("disabled")).toBe(false);
    });

    it("can be disabled", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      expect(radioLocator(page).hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(radioLocator(page).checked).toBe(false);
    });

    it("can be rendered checked", () => {
      const page = render(Component, {
        props: { ...baseProps, checked: true },
      });
      expect(radioLocator(page).checked).toBe(true);
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = render(Component, {
        props: { ...baseProps, text: "Main Text" },
      });
      expect(componentLocator(page).textContent).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = render(Component, {
        props: { ...baseProps, secondaryText: "Secondary Text" },
      });
      expect(componentLocator(page).textContent).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = render(Component, {
        props: { ...baseProps, trailingText: "Trailing Text" },
      });
      expect(componentLocator(page).textContent).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          icon: createRawSnippet(() => ({
            render: () => `<span data-testid="text-icon"></span>`,
          })),
        },
      });
      expect(page.getByTestId("text-icon")).toBeTruthy();
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("radio-option");
}

function radioLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("radio");
}
