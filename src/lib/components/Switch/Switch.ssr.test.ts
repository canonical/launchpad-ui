/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Switch.svelte";
import type { SwitchProps } from "./types.js";

describe("Switch SSR", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseProps = {} satisfies SwitchProps<any>;

  it("doesn't throw", () => {
    expect(() => {
      renderSwitch({ ...baseProps });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = renderSwitch({ ...baseProps });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLInputElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = renderSwitch({ ...baseProps, [attribute]: expected });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = renderSwitch({ ...baseProps, class: "test-class" });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("switch");
    });

    it("applies style", () => {
      const page = renderSwitch({ ...baseProps, style: "color: orange;" });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Switch state", () => {
    it("doesn't include aria-checked attribute", () => {
      const defaultSwitch = componentLocator(renderSwitch({ ...baseProps }));
      const checkedSwitch = componentLocator(
        renderSwitch({
          ...baseProps,
          checked: true,
        }),
      );
      const notCheckedSwitch = componentLocator(
        renderSwitch({
          ...baseProps,
          checked: false,
        }),
      );

      expect(defaultSwitch.hasAttribute("aria-checked")).toBe(false);
      expect(checkedSwitch.hasAttribute("aria-checked")).toBe(false);
      expect(notCheckedSwitch.hasAttribute("aria-checked")).toBe(false);
    });

    it("is not checked by default", () => {
      const page = renderSwitch({ ...baseProps });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("can be checked", () => {
      const page = renderSwitch({ ...baseProps, checked: true });
      expect(componentLocator(page).checked).toBe(true);
    });

    it("isn't disabled by default", () => {
      const page = renderSwitch({ ...baseProps });
      expect(componentLocator(page).hasAttribute("disabled")).toBe(false);
      expect(componentLocator(page).getAttribute("aria-readonly")).not.toBe(
        "true",
      );
    });

    it("can be disabled", () => {
      const page = renderSwitch({ ...baseProps, disabled: true });
      expect(componentLocator(page).getAttribute("aria-readonly")).toBe("true");
      expect(componentLocator(page).hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const page = renderSwitch({
        ...baseProps,
        group: undefined,
        value: undefined,
      });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("isn't checked if group doesn't include value", () => {
      const page = renderSwitch({
        ...baseProps,
        group: ["a", "b"],
        value: "c",
      });
      expect(componentLocator(page).checked).toBe(false);
    });

    it("is checked if group includes value", () => {
      const page = renderSwitch({
        ...baseProps,
        group: ["a", "b", "c"],
        value: "c",
      });
      expect(componentLocator(page).checked).toBe(true);
    });
  });
});

function renderSwitch(props: SwitchProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}

function componentLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("switch");
}
