/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./ButtonPrimitive.svelte";
import type { ButtonPrimitiveProps } from "./types.js";

describe("ButtonPrimitive SSR", () => {
  describe.each(["button", "a"] as const)("as %s", (as) => {
    const baseProps = {
      as,
    } satisfies ButtonPrimitiveProps<typeof as>;

    describe("basics", () => {
      it("doesn't throw", () => {
        expect(() => {
          renderButtonPrimitive(baseProps);
        }).not.toThrow();
      });

      it("renders", () => {
        const { window, container } = renderButtonPrimitive(baseProps);
        expect(container.firstElementChild).toBeInstanceOf(
          as === "button" ? window.HTMLButtonElement : window.HTMLAnchorElement,
        );
      });
    });

    describe("attributes", () => {
      it.each([
        ["id", "test-id"],
        ["style", "color: orange;"],
        ["aria-label", "test-aria-label"],
      ])("applies %s", (attribute, expected) => {
        const { container } = renderButtonPrimitive({
          [attribute]: expected,
          ...baseProps,
        });
        expect(container.firstElementChild?.getAttribute(attribute)).toBe(
          expected,
        );
      });

      it("applies classes", () => {
        const { container } = renderButtonPrimitive({
          class: "test-class",
          ...baseProps,
        });
        const classes = ["test-class"];

        for (const className of classes) {
          expect(container.firstElementChild?.classList).toContain(className);
        }
      });
    });
  });

  describe("anchor specific", () => {
    it("applies href", () => {
      const { container } = renderButtonPrimitive({
        as: "a",
        href: "https://example.com",
      });
      expect(container.firstElementChild?.getAttribute("href")).toBe(
        "https://example.com",
      );
    });

    it("applies disabled", () => {
      const { container } = renderButtonPrimitive({
        as: "a",
        href: "https://example.com",
        disabled: true,
      });
      expect(container.firstElementChild?.getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(container.firstElementChild?.getAttribute("tabindex")).toBe("-1");
      expect(container.firstElementChild?.getAttribute("href")).toBeNull();
    });
  });

  describe("button specific", () => {
    it("applies type", () => {
      const { container } = renderButtonPrimitive({
        as: "button",
        type: "submit",
      });
      expect(container.firstElementChild?.getAttribute("type")).toBe("submit");
    });

    it("applies disabled", () => {
      const { container } = renderButtonPrimitive({
        as: "button",
        disabled: true,
      });
      expect(container.firstElementChild?.getAttribute("disabled")).toBe("");
    });
  });
});

function renderButtonPrimitive<T extends "button" | "a">(
  props: ButtonPrimitiveProps<T>,
) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
