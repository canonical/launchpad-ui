/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./MarkdownEditor.svelte";
import type { MarkdownEditorProps } from "./types.js";

describe("MarkdownEditor SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>MarkdownEditor</span>`,
    })),
  } satisfies MarkdownEditorProps;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const { getByTestId, window } = render(Component, {
        props: { ...baseProps },
      });
      expect(getByTestId("markdown-editor")).toBeInstanceOf(
        window.HTMLDivElement,
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["style", "color: orange;"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const { getByTestId } = render(Component, {
        props: { [attribute]: expected, ...baseProps },
      });
      expect(getByTestId("markdown-editor")?.getAttribute(attribute)).toBe(
        expected,
      );
    });

    it("applies classes", () => {
      const { getByTestId } = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      const classes = ["test-class"];
      classes.push("ds", "markdown-editor");

      for (const className of classes) {
        expect(getByTestId("markdown-editor")?.classList).toContain(className);
      }
    });
  });
});
