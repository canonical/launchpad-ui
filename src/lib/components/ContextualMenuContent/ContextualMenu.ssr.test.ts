/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { assert, describe, expect, it } from "vitest";
import Component from "./ContextualMenuContent.svelte";

describe("ContextualMenuContent SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain("<div");
    expect(body).toContain("</div>");
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

  describe("Helper linking", () => {
    it("doesn't have aria-describedby by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain("aria-describedby");
    });

    it("has aria-describedby properly linked to helper if it is present", () => {
      const { body } = render(Component, {
        props: {
          helper: createRawSnippet<[string]>((id) => ({
            render: () => `<div id="${id()}">Test helper text</div>`,
          })),
        },
      });

      expect(body).toMatch(/aria-describedby="[^"]*"/);
      const idFromAria = body.match(/aria-describedby="([^"]*)"/)?.[1];
      assert(idFromAria !== undefined);
      expect(body).toContain(`<div id="${idFromAria}">Test helper text</div>`);
    });
  });
});
