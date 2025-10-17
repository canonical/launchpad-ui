/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Badge.svelte";

describe("Badge SSR", () => {
  const baseProps = { value: 42 } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });

      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
      expect(componentLocator(page).textContent).toContain("42");
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
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain("badge");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("Display value", () => {
    it("displays the capped variant by default", async () => {
      const page = render(Component, { props: { value: 10000 } });
      expect(componentLocator(page).textContent).toBe("999+");
    });

    describe("capped", () => {
      it("displays 0 for negative values", async () => {
        const page = render(Component, {
          props: { value: -1, variant: "capped" },
        });
        expect(componentLocator(page).textContent).toBe("0");
      });

      it("rounds to the nearest integer", async () => {
        const page = render(Component, {
          props: { value: 42.6, variant: "capped" },
        });
        expect(componentLocator(page).textContent).toBe("43");
      });

      it("displays the values up to 999", async () => {
        const page = render(Component, {
          props: { value: 999, variant: "capped" },
        });
        expect(componentLocator(page).textContent).toBe("999");
      });

      it("caps the value at 999", async () => {
        const page = render(Component, {
          props: { value: 10000, variant: "capped" },
        });
        expect(componentLocator(page).textContent).toBe("999+");
      });
    });

    describe("rounded", () => {
      it("displays 0 for negative values", async () => {
        const page = render(Component, {
          props: { value: -1, variant: "rounded" },
        });
        expect(componentLocator(page).textContent).toBe("0");
      });

      it("rounds to the nearest integer", async () => {
        const page = render(Component, {
          props: { value: 42.6, variant: "rounded" },
        });
        expect(componentLocator(page).textContent).toBe("43");
      });

      it.each([
        [0, "0"],
        [42.6, "43"],
        [999, "999"],
        [1_000, "1K"],
        [1_500, "1.5K"],
        [2_500_000, "2.5M"],
        [1_000_000_000, "1B"],
        [1_234_567_890_123, "1.2T"],
      ])("displays %d as %s", async (input, expected) => {
        const page = render(Component, {
          props: { value: input, variant: "rounded" },
        });
        expect(componentLocator(page).textContent).toBe(expected);
      });
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("badge");
}
