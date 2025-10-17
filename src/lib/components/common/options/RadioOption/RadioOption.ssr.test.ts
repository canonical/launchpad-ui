/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./RadioOption.svelte";
import type { RadioOptionProps } from "./types.js";

const baseProps = {
  text: "Text",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the RadioOption component element.
 * Uses testId as the component doesn't have a single semantic role.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("[data-testid='radio-option']");
}

describe("RadioOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      renderRadioOption({ ...baseProps });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = renderRadioOption({ ...baseProps });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLElement);
    expect(element?.tagName).toBe("LABEL");
    expect(page.container.innerHTML).toContain('type="radio"');
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = renderRadioOption({ ...baseProps, [attribute]: value });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = renderRadioOption({ ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("radio-option")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = renderRadioOption({
        ...baseProps,
        style: "color: orange;",
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toBe("color: orange;");
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = renderRadioOption({ ...baseProps });
      expect(page.container.innerHTML).not.toContain("disabled");
    });

    it("can be disabled", () => {
      const page = renderRadioOption({
        ...baseProps,
        disabled: true,
      });
      expect(page.container.innerHTML).toContain("disabled");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", () => {
      const page = renderRadioOption({ ...baseProps });
      expect(page.container.innerHTML).toContain('type="radio"');
      expect(page.container.innerHTML).not.toMatch(/type="radio"[^>]*checked/);
    });

    it("can be rendered checked", () => {
      const page = renderRadioOption({
        ...baseProps,
        checked: true,
      });
      expect(page.container.innerHTML).toMatch(/type="radio"[^>]*checked/);
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = renderRadioOption({ ...baseProps, text: "Main Text" });
      expect(page.container.innerHTML).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = renderRadioOption({
        ...baseProps,
        text: "Main Text",
        secondaryText: "Secondary Text",
      });
      expect(page.container.innerHTML).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = renderRadioOption({
        ...baseProps,
        text: "Main Text",
        trailingText: "Trailing Text",
      });
      expect(page.container.innerHTML).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = renderRadioOption({
        ...baseProps,
        text: "Main Text",
        icon: createRawSnippet(() => ({
          render: () => `<span class="text-icon-class"></span>`,
        })),
      });
      expect(page.container.innerHTML).toContain('class="text-icon-class"');
    });
  });
});

function renderRadioOption(props: RadioOptionProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
