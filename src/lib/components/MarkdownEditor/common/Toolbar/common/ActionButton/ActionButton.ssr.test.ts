/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./ActionButton.svelte";
import type { MarkdownEditorToolbarActionButtonProps } from "./types.js";

describe("Markdown Editor > Toolbar > ActionButton SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>ActionButton</span>`,
    })),
  } satisfies MarkdownEditorToolbarActionButtonProps;

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
      classes.push("ds", "markdown-editor-toolbar-action-button");

      for (const className of classes) {
        expect(container.firstElementChild?.classList).toContain(className);
      }
    });

    it("disabled by default", () => {
      const { container } = render(Component, {
        props: { ...baseProps },
      });
      expect(
        container.firstElementChild?.getAttribute("disabled"),
      ).toBeDefined();
    });
  });
});
