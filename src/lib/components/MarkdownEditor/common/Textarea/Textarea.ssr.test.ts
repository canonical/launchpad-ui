/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import Component from "./Textarea.svelte";
import type { MarkdownEditorContext } from "./types.js";

describe("Textarea SSR", () => {
  const baseProps = {
    value: "Textarea",
  } satisfies MarkdownEditorContext;

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
      expect(container.firstElementChild).toBeInstanceOf(
        window.HTMLTextAreaElement,
      );
      const textarea = container.firstElementChild as HTMLTextAreaElement;
      expect(textarea.value).toBe("Textarea");
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
      classes.push("ds", "textarea");

      for (const className of classes) {
        expect(container.firstElementChild?.classList).toContain(className);
      }
    });
  });
});
