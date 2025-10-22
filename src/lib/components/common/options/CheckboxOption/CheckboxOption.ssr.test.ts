/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./CheckboxOption.svelte";
import type { CheckboxOptionProps } from "./types.js";

describe("CheckboxOption SSR", () => {
  const baseProps = {
    text: "Text",
  } satisfies ComponentProps<typeof Component>;
  it("doesn't throw", () => {
    expect(() => {
      renderCheckboxOption({ ...baseProps });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = renderCheckboxOption({ ...baseProps });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLLabelElement);
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = renderCheckboxOption({ ...baseProps, [attribute]: value });
      const element = componentLocator(page);
      expect(element.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        class: "test-class",
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("checkbox-option")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        style: "color: orange;",
      });
      expect(componentLocator(page).getAttribute("style")).toBe(
        "color: orange;",
      );
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = renderCheckboxOption({ ...baseProps });
      expect(checkboxLocator(page).hasAttribute("disabled")).toBe(false);
    });

    it("can be disabled", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        disabled: true,
      });
      expect(checkboxLocator(page).hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", () => {
      const page = renderCheckboxOption({ ...baseProps });
      expect(checkboxLocator(page).checked).toBe(false);
    });

    it("can be rendered checked", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        checked: true,
      });
      expect(checkboxLocator(page).checked).toBe(true);
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = renderCheckboxOption({ ...baseProps, text: "Main Text" });
      expect(componentLocator(page).textContent).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        secondaryText: "Secondary Text",
      });
      expect(componentLocator(page).textContent).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        trailingText: "Trailing Text",
      });
      expect(componentLocator(page).textContent).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = renderCheckboxOption({
        ...baseProps,
        icon: createRawSnippet(() => ({
          render: () => `<span data-testid="text-icon"></span>`,
        })),
      });
      expect(page.getByTestId("text-icon")).toBeTruthy();
    });
  });
});

function renderCheckboxOption(props: CheckboxOptionProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("checkbox-option");
}

function checkboxLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("checkbox");
}
