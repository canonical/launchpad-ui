/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Radio.svelte";
import type { RadioProps } from "./types.js";

describe("Radio SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      renderRadio();
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain('<input type="radio"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = renderRadio({ id: "test-id" });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = renderRadio({ class: "test-class" });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = renderRadio({ style: "color: red;" });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Checked state", () => {
    it("isn't checked by default", () => {
      const { body } = renderRadio();
      expect(body).not.toContain("checked");
    });

    it("can be checked", () => {
      const { body } = renderRadio({ checked: true });
      expect(body).toContain("checked");
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const { body } = renderRadio({ group: undefined, value: undefined });
      expect(body).not.toContain("checked");
    });

    it("isn't checked if group doesn't match value", () => {
      const body = renderRadio({
        group: "test-group",
        value: "test-value",
      }).body;
      expect(body).not.toContain("checked");
    });

    it("is checked if group matches value", () => {
      const { body } = renderRadio({
        group: "test-group",
        value: "test-group",
      });
      expect(body).toContain("checked");
    });
  });
});

function renderRadio(props?: RadioProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
