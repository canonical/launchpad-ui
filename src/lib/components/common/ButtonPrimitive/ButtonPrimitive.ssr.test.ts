/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./ButtonPrimitive.svelte";
import type { ButtonPrimitiveProps } from "./types.js";

describe("ButtonPrimitive SSR", () => {
  describe.each(["button", "a"] as const)("as %s", (as) => {
    const baseProps = {
      as,
      ...(as === "a" && { href: "https://example.com" }),
    } satisfies ButtonPrimitiveProps<typeof as>;

    it("doesn't throw", () => {
      expect(() => {
        renderButtonPrimitive(baseProps);
      }).not.toThrow();
    });

    it("renders", () => {
      const page = renderButtonPrimitive(baseProps);
      expect(componentLocator(page, as)).toBeInstanceOf(
        page.window.HTMLElement,
      );
    });

    describe("attributes", () => {
      it.each([
        ["id", "test-id"],
        ["aria-label", "test-aria-label"],
      ])("applies %s", (attribute, expected) => {
        const page = renderButtonPrimitive({
          [attribute]: expected,
          ...baseProps,
        });
        expect(componentLocator(page, as).getAttribute(attribute)).toBe(
          expected,
        );
      });

      it("applies classes", () => {
        const page = renderButtonPrimitive({
          class: "test-class",
          ...baseProps,
        });
        expect(componentLocator(page, as).classList).toContain("test-class");
      });

      it("applies style", () => {
        const page = renderButtonPrimitive({
          style: "color: orange;",
          ...baseProps,
        });
        expect(componentLocator(page, as).style.color).toBe("orange");
      });
    });
  });

  describe("anchor specific", () => {
    it("applies href", () => {
      const page = renderButtonPrimitive({
        as: "a",
        href: "https://example.com",
      });
      expect(componentLocator(page, "a").getAttribute("href")).toBe(
        "https://example.com",
      );
    });

    it("applies disabled", () => {
      const page = renderButtonPrimitive({
        as: "a",
        href: "https://example.com",
        disabled: true,
      });
      expect(componentLocator(page, "a").getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(componentLocator(page, "a").getAttribute("tabindex")).toBe("-1");
      expect(componentLocator(page, "a").hasAttribute("href")).toBe(false);
    });
  });

  describe("button specific", () => {
    it("applies type", () => {
      const page = renderButtonPrimitive({
        as: "button",
        type: "submit",
      });
      expect(componentLocator(page, "button").getAttribute("type")).toBe(
        "submit",
      );
    });

    it("applies disabled", () => {
      const page = renderButtonPrimitive({
        as: "button",
        disabled: true,
      });
      expect(componentLocator(page, "button").hasAttribute("disabled")).toBe(
        true,
      );
    });
  });
});

function componentLocator<T extends "button" | "a">(
  page: RenderResult,
  as: T,
): T extends "button" ? HTMLButtonElement : HTMLAnchorElement {
  const role = as === "a" ? "link" : "button";
  return page.getByRole(role);
}

function renderButtonPrimitive<T extends "button" | "a">(
  props: ButtonPrimitiveProps<T>,
) {
  // @ts-expect-error TypeScript reports `Expression produces a union type that is too complex to represent.ts(2590)`
  return render(Component, { props });
}
