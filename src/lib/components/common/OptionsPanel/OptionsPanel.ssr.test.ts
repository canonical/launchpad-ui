/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import Component from "./OptionsPanel.svelte";

describe("OptionsPanel SSR", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLElement);
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("options-panel");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Helper linking", () => {
    it("doesn't have aria-describedby by default", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(
        componentLocator(page).getAttribute("aria-describedby"),
      ).toBeNull();
    });

    it("has aria-describedby properly linked to helper if it is present", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          helper: createRawSnippet<[string]>((id) => ({
            render: () =>
              `<div id="${id()}" data-testid="helper">Test helper text</div>`,
          })),
        },
      });

      const ariaDescribedby =
        componentLocator(page).getAttribute("aria-describedby");
      assert(ariaDescribedby !== null);
      expect(page.getByTestId("helper").id).toBe(ariaDescribedby);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("options-panel");
}
