/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./SwitchOption.svelte";
import type { SwitchOptionProps } from "./types.js";

const baseProps = {
  text: "Text",
} satisfies ComponentProps<typeof Component>;

/**
 * Returns the SwitchOption component element.
 * Uses testId as the component doesn't have a single semantic role.
 */
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.container.querySelector("[data-testid='switch-option']");
}

describe("SwitchOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      renderSwitchOption({ ...baseProps });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = renderSwitchOption({ ...baseProps });
    const element = componentLocator(page);
    expect(element).toBeInstanceOf(page.window.HTMLElement);
    expect(element?.tagName).toBe("LABEL");
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = renderSwitchOption({
        ...baseProps,
        [attribute]: value,
      });
      const element = componentLocator(page);
      expect(element?.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = renderSwitchOption({
        ...baseProps,
        class: "test-class",
      });
      const element = componentLocator(page);
      expect(element?.classList.contains("ds")).toBe(true);
      expect(element?.classList.contains("switch-option")).toBe(true);
      expect(element?.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = renderSwitchOption({
        ...baseProps,
        style: "color: orange;",
      });
      const element = componentLocator(page);
      expect(element?.getAttribute("style")).toBe("color: orange;");
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = renderSwitchOption({ ...baseProps });
      expect(page.container.innerHTML).not.toContain("disabled");
    });

    it("can be disabled", () => {
      const page = renderSwitchOption({
        ...baseProps,
        disabled: true,
      });
      expect(page.container.innerHTML).toContain("disabled");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", () => {
      const page = renderSwitchOption({ ...baseProps });
      expect(page.container.innerHTML).not.toContain("checked");
    });

    it("can be rendered checked", () => {
      const page = renderSwitchOption({
        ...baseProps,
        checked: true,
      });
      expect(page.container.innerHTML).toContain("checked");
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = renderSwitchOption({ ...baseProps, text: "Main Text" });
      expect(page.container.innerHTML).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = renderSwitchOption({
        ...baseProps,
        text: "Main Text",
        secondaryText: "Secondary Text",
      });
      expect(page.container.innerHTML).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = renderSwitchOption({
        ...baseProps,
        text: "Main Text",
        trailingText: "Trailing Text",
      });
      expect(page.container.innerHTML).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = renderSwitchOption({
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

function renderSwitchOption(props: SwitchOptionProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
