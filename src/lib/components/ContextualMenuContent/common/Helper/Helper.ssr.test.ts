/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Helper.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Helper text</span>",
}));

describe("Helper SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { children, id: "helper-id" } });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("with required props", () => {
      const { body } = render(Component, {
        props: { children, id: "helper-id" },
      });
      expect(body).toContain("<div");
      expect(body).toContain("</div>");
    });

    it("with icon", () => {
      const { body } = render(Component, {
        props: {
          children,
          id: "helper-id",
          icon: createRawSnippet(() => ({
            render: () => '<span data-testid="icon">Icon</span>',
          })),
        },
      });
      expect(body).toContain('<span data-testid="icon">Icon</span>');
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { children, id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { children, id: "test-id", class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { children, id: "test-id", style: "color: red;" },
      });
      expect(body).toContain('style="color: red;"');
    });
  });
});
