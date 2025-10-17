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
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const body = componentLocator(page);
    expect(body).toBeTruthy();
    expect(body?.tagName).toBe("INPUT");
    expect(body?.getAttribute("type")).toBe("checkbox");
    expect(body?.getAttribute("role")).toBe("switch");
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderSwitch({ [attribute]: expected } as any);
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderSwitch({ class: "test-class" } as any);
      expect(componentLocator(page)?.classList).toContain("test-class");
      expect(componentLocator(page)?.classList).toContain("ds");
      expect(componentLocator(page)?.classList).toContain("switch");
    });

    it("applies style", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderSwitch({ style: "color: orange;" } as any);
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("Switch state", () => {
    it("doesn't include aria-checked attribute", () => {
      const bodyDefault = componentLocator(renderSwitch());
      const bodyChecked = componentLocator(
        renderSwitch({
          checked: true,
        }),
      );
      const bodyNotChecked = componentLocator(
        renderSwitch({
          checked: false,
        }),
      );

      expect(bodyDefault?.hasAttribute("aria-checked")).toBe(false);
      expect(bodyChecked?.hasAttribute("aria-checked")).toBe(false);
      expect(bodyNotChecked?.hasAttribute("aria-checked")).toBe(false);
    });

    it("is not checked by default", () => {
      const body = componentLocator(renderSwitch());
      expect(body).not.toHaveProperty("checked", true);
    });

    it("can be checked", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = componentLocator(renderSwitch({ checked: true } as any));
      expect(body).toHaveProperty("checked", true);
    });

    it("isn't disabled by default", () => {
      const body = componentLocator(renderSwitch());
      expect(body?.getAttribute("aria-readonly")).not.toBe("true");
    });

    it("can be disabled", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = componentLocator(renderSwitch({ disabled: true } as any));
      expect(body?.getAttribute("aria-readonly")).toBe("true");
      expect(body).toHaveProperty("disabled", true);
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const body = componentLocator(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderSwitch({ group: undefined, value: undefined } as any),
      );
      expect(body).not.toHaveProperty("checked", true);
    });

    it("isn't checked if group doesn't include value", () => {
      const body = componentLocator(
        renderSwitch({
          group: ["a", "b"],
          value: "c",
        }),
      );
      expect(body).not.toHaveProperty("checked", true);
    });

    it("is checked if group includes value", () => {
      const body = componentLocator(
        renderSwitch({
          group: ["a", "b", "c"],
          value: "c",
        }),
      );
      expect(body).toHaveProperty("checked", true);
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSwitch(props?: SwitchProps<any>) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props: { ...baseProps, ...props } });
}

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.getByRole("switch");
}
