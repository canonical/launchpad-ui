/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Loading.svelte";

describe("Loading SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("default content", () => {
      const { body } = render(Component);
      expect(body).toContain("<div");
      expect(body).toContain("Loading…");
      expect(body).toContain("</div>");
    });

    it("with children", () => {
      const { body } = render(Component, {
        props: {
          children: createRawSnippet(() => ({
            render: () => "<span>Fetching data</span>",
          })),
        },
      });
      expect(body).toContain("Fetching data");
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;" },
      });
      expect(body).toContain('style="color: red;"');
    });
  });
});
