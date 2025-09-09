/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./CheckboxOption.svelte";
import type { CheckboxOptionProps } from "./types.js";

describe("CheckboxOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      renderCheckboxOption({ text: "Text" });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = renderCheckboxOption({ text: "Text" });
    expect(body).toContain("<label");
    expect(body).toContain('type="checkbox"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = renderCheckboxOption({ text: "Text", id: "test-id" });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = renderCheckboxOption({
        text: "Text",
        class: "test-class",
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = renderCheckboxOption({
        text: "Text",
        style: "color: red;",
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const { body } = renderCheckboxOption({ text: "Text" });
      expect(body).not.toContain("disabled");
    });

    it("can be disabled", () => {
      const { body } = renderCheckboxOption({
        text: "Text",
        disabled: true,
      });
      expect(body).toContain("disabled");
    });
  });

  describe("Checked state", () => {
    it("is not checked by default", () => {
      const { body } = renderCheckboxOption({ text: "Text" });
      expect(body).not.toMatch(/type="checkbox"[^>]*checked/);
    });

    it("can be rendered checked", () => {
      const { body } = renderCheckboxOption({
        text: "Text",
        checked: true,
      });
      expect(body).toMatch(/type="checkbox"[^>]*checked/);
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const { body } = renderCheckboxOption({ text: "Main Text" });
      expect(body).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const { body } = renderCheckboxOption({
        text: "Main Text",
        secondaryText: "Secondary Text",
      });
      expect(body).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const { body } = renderCheckboxOption({
        text: "Main Text",
        trailingText: "Trailing Text",
      });
      expect(body).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const { body } = renderCheckboxOption({
        text: "Main Text",
        icon: createRawSnippet(() => ({
          render: () => `<span class="text-icon-class"></span>`,
        })),
      });
      expect(body).toContain('class="text-icon-class"');
    });
  });
});

function renderCheckboxOption(props: CheckboxOptionProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
