/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./JobStatusIcon.svelte";

describe("JobStatusIcon SSR", () => {
  const baseProps = {
    status: null,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it.each([
      "PENDING",
      "EXECUTING",
      "IDLE",
      "FINISHED",
      "FAILED",
      "CANCELLED",
      null,
    ] as const)("renders %s", (status) => {
      const page = render(Component, { props: { ...baseProps, status } });
      expect(componentLocator(page, status)).toBeInstanceOf(
        page.window.SVGElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([["id", "test-id"]])("applies %s", (attribute, expected) => {
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
  });
});

function componentLocator(
  page: RenderResult,
  status: string | null = null,
): HTMLElement {
  const regexp = status ? new RegExp(`${status}`) : /Unknown/;
  return page.getByRole("img", { name: regexp });
}
