/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Switch.svelte";
import type { SwitchProps } from "./types.js";

describe("Switch SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain('<input type="checkbox" role="switch"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = renderSwitch({ id: "test-id" });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = renderSwitch({ class: "test-class" });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = renderSwitch({ style: "color: red;" });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Switch state", () => {
    it("doesn't include aria-checked attribute", () => {
      const { body: bodyDefault } = renderSwitch();
      const { body: bodyChecked } = renderSwitch({
        checked: true,
      });
      const { body: bodyNotChecked } = renderSwitch({
        checked: false,
      });

      expect(bodyDefault).not.toContain("aria-checked");
      expect(bodyChecked).not.toContain("aria-checked");
      expect(bodyNotChecked).not.toContain("aria-checked");
    });

    it("is not checked by default", () => {
      const { body } = renderSwitch();
      expect(body).not.toContain("checked");
    });

    it("can be checked", () => {
      const { body } = renderSwitch({ checked: true });
      expect(body).toContain("checked");
    });

    it("isn't disabled by default", () => {
      const { body } = renderSwitch();
      expect(body).not.toContain('aria-readonly="true"');
    });

    it("can be disabled", () => {
      const { body } = renderSwitch({ disabled: true });
      expect(body).toContain('aria-readonly="true"');
      expect(body).toContain("disabled");
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const { body } = renderSwitch({ group: undefined, value: undefined });
      expect(body).not.toContain("checked");
    });

    it("isn't checked if group doesn't include value", () => {
      const { body } = renderSwitch({
        group: ["a", "b"],
        value: "c",
      });
      expect(body).not.toContain("checked");
    });

    it("is checked if group includes value", () => {
      const { body } = renderSwitch({
        group: ["a", "b", "c"],
        value: "c",
      });
      expect(body).toContain("checked");
    });
  });
});

function renderSwitch(props?: SwitchProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
