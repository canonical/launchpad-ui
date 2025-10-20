/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Radio.svelte";
import type { RadioProps } from "./types.js";

describe("Radio SSR", () => {
  const baseProps = {} satisfies RadioProps;

  it("doesn't throw", () => {
    expect(() => {
      renderRadio({ ...baseProps });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = renderRadio({ ...baseProps });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLInputElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = renderRadio({ [attribute]: expected });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = renderRadio({ class: "test-class" });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("radio");
    });

    it("applies style", () => {
      const page = renderRadio({ style: "color: orange;" });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Checked state", () => {
    it("isn't checked by default", () => {
      const page = renderRadio({});
      expect(componentLocator(page).checked).toBe(false);
    });

    it("can be checked", () => {
      const page = renderRadio({ checked: true });
      expect(componentLocator(page).checked).toBe(true);
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const page = renderRadio({ group: undefined, value: undefined });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("isn't checked if group doesn't match value", () => {
      const page = renderRadio({
        group: "test-group",
        value: "test-value",
      });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("is checked if group matches value", () => {
      const page = renderRadio({
        group: "test-group",
        value: "test-group",
      });
      expect(componentLocator(page).checked).toBe(true);
    });
  });
});

function renderRadio(props: RadioProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}

function componentLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("radio");
}
