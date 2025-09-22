/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Toolbar.svelte";
import type { ToolbarProps } from "./types.js";

describe("Markdown > Toolbar SSR", () => {
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

    it("doesn't renders (client side)", () => {
      const { container } = render(Component, {
        props: { ...baseProps },
      });
      expect(container.children.length).toBe(0);
    });
  });
});
