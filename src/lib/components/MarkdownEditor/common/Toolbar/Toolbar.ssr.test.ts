/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Component from "./Toolbar.svelte";
import type { ToolbarProps } from "./types.js";

vi.mock("$lib/shortcuts/index.js", async (importActual) => {
  const actual = await importActual<typeof import("$lib/shortcuts/index.js")>();
  const useShortcuts = () => () => [];
  return {
    ...actual,
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts,
  };
});

describe("Markdown Editor > Toolbar SSR", () => {
  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>Toolbar</span>`,
    })),
  } satisfies ToolbarProps;

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
      classes.push("ds", "markdown-editor-toolbar");

      for (const className of classes) {
        expect(container.firstElementChild?.classList).toContain(className);
      }
    });
  });
});
