/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Separator.svelte";
import type { SeparatorProps } from "./types.js";

describe("Separator SSR", () => {
  const baseProps = {} satisfies SeparatorProps;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const { window, container } = render(Component, {
        props: { ...baseProps },
      });
      expect(container.firstElementChild).toBeInstanceOf(window.HTMLDivElement);
    });

    it("has the separator role", async () => {
      const { findByRole } = render(Component, {
        props: { ...baseProps },
      });
      const element = await findByRole("separator");
      expect(element).toBeDefined();
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["style", "color: orange;"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const { container } = render(Component, {
        props: { [attribute]: expected, ...baseProps },
      });
      expect(container.firstElementChild?.getAttribute(attribute)).toBe(
        expected,
      );
    });

    it("applies classes", () => {
      const { container } = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      const classes = ["test-class"];
      classes.push("ds", "markdown-editor-toolbar-separator");

      for (const className of classes) {
        expect(container.firstElementChild?.classList).toContain(className);
      }
    });
  });
});
