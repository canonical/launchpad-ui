/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Checkbox.svelte";
import type { CheckboxProps } from "./types.js";

describe("Checkbox SSR", () => {
  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        renderCheckbox({});
      }).not.toThrow();
    });

    it("renders", () => {
      const page = renderCheckbox({});
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLInputElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = renderCheckbox({ [attribute]: expected });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = renderCheckbox({ class: "test-class" });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("checkbox");
    });

    it("applies style", () => {
      const page = renderCheckbox({ style: "color: orange;" });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Checked state", () => {
    it("isn't checked by default", () => {
      const page = renderCheckbox({});
      expect(componentLocator(page).checked).toBe(false);
    });

    it("can be checked", () => {
      const page = renderCheckbox({ checked: true });
      expect(componentLocator(page).checked).toBe(true);
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const page = renderCheckbox({ group: undefined, value: undefined });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("isn't checked if group doesn't include value", () => {
      const page = renderCheckbox({
        group: ["a", "b"],
        value: "c",
      });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("is checked if group includes value", () => {
      const page = renderCheckbox({
        group: ["a", "b", "c"],
        value: "c",
      });
      expect(componentLocator(page).checked).toBe(true);
    });
  });
});

function renderCheckbox(props: CheckboxProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}

function componentLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("checkbox");
}
