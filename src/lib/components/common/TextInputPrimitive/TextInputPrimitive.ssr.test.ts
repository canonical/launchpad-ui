/* @canonical/generator-ds 0.10.0-experimental.4 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./TextInputPrimitive.svelte";
import type { TextInputPrimitiveProps } from "./types.js";

describe("TextInputPrimitive SSR", () => {
  const baseProps = {} satisfies TextInputPrimitiveProps;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLInputElement,
      );
    });
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
        props: { class: "test-class", ...baseProps },
      });
      expect(componentLocator(page).classList).toContain("test-class");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { style: "color: orange;", ...baseProps },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });

    describe("type", () => {
      it("defaults to text", () => {
        const page = render(Component, { props: { ...baseProps } });
        expect(componentLocator(page).type).toBe("text");
      });

      it.each(["text", "email", "url", "tel"] as const)(
        "accepts %s",
        (type) => {
          const page = render(Component, {
            props: { type, ...baseProps },
          });
          expect(componentLocator(page).type).toBe(type);
        },
      );

      it("accepts search", () => {
        const page = render(Component, {
          props: { type: "search", ...baseProps },
        });
        expect((page.getByRole("searchbox") as HTMLInputElement).type).toBe(
          "search",
        );
      });
    });

    it("applies value", () => {
      const page = render(Component, {
        props: { value: "test value", ...baseProps },
      });
      expect(componentLocator(page).value).toBe("test value");
    });

    it("applies validation attributes", () => {
      const page = render(Component, {
        props: {
          required: true,
          minlength: 2,
          maxlength: 10,
          pattern: "\\d+",
          ...baseProps,
        },
      });
      expect(componentLocator(page).required).toBe(true);
      expect(componentLocator(page).minLength).toBe(2);
      expect(componentLocator(page).maxLength).toBe(10);
      expect(componentLocator(page).pattern).toBe("\\d+");
    });

    describe("disabled", () => {
      it("isn't disabled by default", () => {
        const page = render(Component, { props: { ...baseProps } });
        expect(componentLocator(page).disabled).toBe(false);
      });

      it("can be disabled", () => {
        const page = render(Component, {
          props: { disabled: true, ...baseProps },
        });
        expect(componentLocator(page).disabled).toBe(true);
      });
    });
  });
});

function componentLocator(page: RenderResult): HTMLInputElement {
  return page.getByRole("textbox");
}
