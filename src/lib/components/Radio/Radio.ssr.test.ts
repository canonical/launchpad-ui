/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Radio.svelte";
import type { RadioProps } from "./types.js";

describe("Radio SSR", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseProps = {} satisfies RadioProps<any>;

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
    expect(body?.getAttribute("type")).toBe("radio");
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderRadio({ [attribute]: expected } as any);
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderRadio({ class: "test-class" } as any);
      expect(componentLocator(page)?.classList).toContain("test-class");
      expect(componentLocator(page)?.classList).toContain("ds");
      expect(componentLocator(page)?.classList).toContain("radio");
    });

    it("applies style", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = renderRadio({ style: "color: orange;" } as any);
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  describe("Checked state", () => {
    it("isn't checked by default", () => {
      const body = componentLocator(renderRadio());
      expect(body).not.toHaveProperty("checked", true);
    });

    it("can be checked", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = componentLocator(renderRadio({ checked: true } as any));
      expect(body).toHaveProperty("checked", true);
    });
  });

  describe("Group controlled", () => {
    it("isn't checked if group and value are undefined", () => {
      const body = componentLocator(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderRadio({ group: undefined, value: undefined } as any),
      );
      expect(body).not.toHaveProperty("checked", true);
    });

    it("isn't checked if group doesn't match value", () => {
      const body = componentLocator(
        renderRadio({
          group: "test-group",
          value: "test-value",
        }),
      );
      expect(body).not.toHaveProperty("checked", true);
    });

    it("is checked if group matches value", () => {
      const body = componentLocator(
        renderRadio({
          group: "test-group",
          value: "test-group",
        }),
      );
      expect(body).toHaveProperty("checked", true);
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRadio(props?: RadioProps<any>) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props: { ...baseProps, ...props } });
}

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.getByRole("radio");
}
