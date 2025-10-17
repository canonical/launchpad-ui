/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Checkbox.svelte";
import type { CheckboxProps } from "./types.js";

describe("Checkbox SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      renderCheckbox();
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain('<input type="checkbox"');
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const result = renderCheckbox({ [attribute]: expected });
      expect(result.body).toContain(`${attribute}="${expected}"`);
    });

    it("applies classes", () => {
      const result = renderCheckbox({ class: "test-class" });
      expect(result.body).toMatch(/class="[^"]*test-class[^"]*"/);
      expect(result.body).toMatch(/class="[^"]*ds[^"]*"/);
      expect(result.body).toMatch(/class="[^"]*checkbox[^"]*"/);
    });

    it("applies style", () => {
      const result = renderCheckbox({ style: "color: orange;" });
      expect(result.body).toContain('style="color: orange;"');
    });
  });

  describe("Checked state", () => {
    it("isn't checked by default", () => {
      const { body } = renderCheckbox();
      expect(body).not.toContain("checked");
    });

    it("can be checked", () => {
      const { body } = renderCheckbox({ checked: true });
      expect(body).toContain("checked");
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const { body } = renderCheckbox({ group: undefined, value: undefined });
      expect(body).not.toContain("checked");
    });

    it("isn't checked if group doesn't include value", () => {
      const body = renderCheckbox({
        group: ["a", "b"],
        value: "c",
      }).body;
      expect(body).not.toContain("checked");
    });

    it("is checked if group includes value", () => {
      const { body } = renderCheckbox({
        group: ["a", "b", "c"],
        value: "c",
      });
      expect(body).toContain("checked");
    });
  });
});

function renderCheckbox(props?: CheckboxProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
