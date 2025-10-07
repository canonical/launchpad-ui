/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./ExpandToggle.svelte";

describe("ExpandToggle SSR", () => {
  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component);
      }).not.toThrow();
    });

    it("renders", () => {
      const { window, container } = render(Component);
      expect(container.firstElementChild).toBeInstanceOf(
        window.HTMLButtonElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["style", "color: orange;"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const { container } = render(Component, {
        props: { [attribute]: expected },
      });
      expect(container.firstElementChild?.getAttribute(attribute)).toBe(
        expected,
      );
    });

    it("applies classes", () => {
      const { container } = render(Component, {
        props: { class: "test-class" },
      });
      const classes = ["test-class"];
      classes.push("ds", "side-navigation-expand-toggle");

      for (const className of classes) {
        expect(container.firstElementChild?.classList).toContain(className);
      }
    });
  });
});
