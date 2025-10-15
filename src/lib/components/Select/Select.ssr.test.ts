/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Select.svelte";
import type { SelectProps } from "./types";

describe("Select SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<option value="1">Option 1</option>`,
    })),
    multiple: false,
  } satisfies SelectProps<string>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        renderSelect();
      }).not.toThrow();
    });

    it("renders", () => {
      const { window, container } = renderSelect({
        ...baseProps,
      });
      expect(container.firstElementChild).toBeInstanceOf(window.HTMLDivElement);
      expect(container.firstElementChild?.firstElementChild).toBeInstanceOf(
        window.HTMLSelectElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["style", "color: orange;"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const { container } = renderSelect({
        [attribute]: expected,
        ...baseProps,
      });
      expect(
        container.firstElementChild?.firstElementChild?.getAttribute(attribute),
      ).toBe(expected);
    });

    it("applies classes", () => {
      const { container } = renderSelect({
        class: "test-class",
        ...baseProps,
      });
      const classes = ["test-class"];
      classes.push("ds", "select");

      for (const className of classes) {
        expect(
          container.firstElementChild?.firstElementChild?.classList,
        ).toContain(className);
      }
    });
  });
});

function renderSelect(props?: SelectProps) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
